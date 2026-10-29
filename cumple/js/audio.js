/* ============================================================
   PARTITURA DEL PARQUE  (aquí editas las notas)
   Formato: ["NOTA", inicio, duración]   (en tiempos; 1 tiempo = "tiempo" segundos)
   Ejemplos de nota: "A4", "F#4", "Bb3".  Para silencio simplemente no pongas nota.
   arpegio(["A2","E3"], inicio, cuántasNotas, paso) repite un patrón de la mano izquierda.
   ============================================================ */
const arpegio = (patron, inicio, n, paso = .5) => Array.from({ length: n }, (_, i) => [patron[i % patron.length], inicio + i * paso, paso]);
// Mano izquierda: fusas (4 notas por tiempo). Cada acorde sube y baja (12 notas) y se toca 2 veces por compás = 24 notas.
const ACORDES = {
  F: ["F3", "C4", "F4", "A4", "C5", "F5", "C5", "A4", "F4", "C4", "A3", "C4"],
  G: ["G3", "D4", "G4", "B4", "D5", "G5", "D5", "B4", "G4", "D4", "B3", "D4"],
  Am: ["A3", "E4", "A4", "C5", "E5", "A5", "E5", "C5", "A4", "E4", "C4", "E4"]
};
// Un acorde por compás (compases 1 al 16). Compases 14-16 asumidos (Sol, Fa, Sol): edítalos si no suenan bien.
const PROGRESION = "F G F G Am G F G Am G F G F G F G".split(" ");
const COMPAS = 6; // un compás de 6/8 = 6 tiempos (corcheas)

const PARTITURA = {
  tiempo: 0.3,             // segundos por tiempo (6/8 a ~67 bpm); más grande = más lento
  repetirCada: 33,         // segundos antes de repetir (16 compases = 28.8 s + resonancia)
  manoIzquierda: PROGRESION.flatMap((ac, i) => arpegio(ACORDES[ac], i * COMPAS, 24, .25)),
  manoDerecha: [           // silencio en los compases 1-12; entra en el compás 13 (tiempo 72)
    // Compás 13: Mi | Mi-Re (semicorcheas) | Do | Si | La (negra)
    ["E5", 72, 1], ["E5", 73, .5], ["D5", 73.5, .5], ["C5", 74, 1], ["B4", 75, 1], ["A4", 76, 2],
    // Compás 14: silencio | Si | Do | La (negra con puntillo)
    ["B4", 79, 1], ["C5", 80, 1], ["A4", 81, 3],
    // Compás 15: igual que el 13
    ["E5", 84, 1], ["E5", 85, .5], ["D5", 85.5, .5], ["C5", 86, 1], ["B4", 87, 1], ["A4", 88, 2],
    // Compás 16: Fa | Mi-Re | Do | Si | La (mantenida)
    ["F5", 90, 1], ["E5", 91, .5], ["D5", 91.5, .5], ["C5", 92, 1], ["B4", 93, 1], ["A4", 94, 2]
  ]
};

/* Música y ambiente por escenario (tus funciones de sonido, adaptadas para
   usar un único AudioContext y poder detenerse con fundido al cambiar de escenario) */
const Sound = (() => {
  let bus = null, timers = [], sources = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const newBus = (vol = 1) => { bus = audio.createGain(); bus.gain.value = vol; bus.connect(audio.destination); return bus; };

  function stop(fade = .6) {
    timers.forEach(clearTimeout); timers = [];
    if (!bus) return;
    const b = bus, src = sources; bus = null; sources = [];
    b.gain.cancelScheduledValues(audio.currentTime);
    b.gain.setValueAtTime(b.gain.value, audio.currentTime);
    b.gain.linearRampToValueAtTime(0, audio.currentTime + fade);
    setTimeout(() => { src.forEach((s) => { try { s.stop(); } catch (e) { } }); b.disconnect(); }, fade * 1000 + 100);
  }

  /* Escenario 1 · Obra: murmullo + golpes esporádicos */
  function iniciarAmbienteObra(out) {
    const size = audio.sampleRate * 2, buf = audio.createBuffer(1, size, audio.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const ruido = audio.createBufferSource(); ruido.buffer = buf; ruido.loop = true;
    const filtro = audio.createBiquadFilter(); filtro.type = "lowpass"; filtro.frequency.value = 400;
    const vol = audio.createGain(); vol.gain.value = 0.05;
    ruido.connect(filtro); filtro.connect(vol); vol.connect(out);
    ruido.start(); sources.push(ruido);

    const golpe = () => {
      const t = audio.currentTime, osc = audio.createOscillator(), g = audio.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(100, t); osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.3);
      later(golpe, 3000 + Math.random() * 12000);
    };
    golpe();
  }

  /* ---- Motor de piano: timbre con armónicos + pedal + sala (reverb) ---- */
  let onda = null;
  const MIDI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(n) {                                  // "A4" -> 440, "F#4", "Bb3"
    const m = /^([A-G])([#b]?)(\d)$/.exec(n); if (!m) return 0;
    const semi = MIDI[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (+m[3] + 1) * 12;
    return 440 * Math.pow(2, (semi - 69) / 12);
  }
  function conReverb(out, mezcla = 0.3) {
    const inp = audio.createGain(), conv = audio.createConvolver(), wet = audio.createGain();
    const len = audio.sampleRate * 2.5, ir = audio.createBuffer(2, len, audio.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); }
    conv.buffer = ir; wet.gain.value = mezcla;
    inp.connect(out); inp.connect(conv); conv.connect(wet); wet.connect(out);
    return inp;
  }
  function notaPiano(out, f, t, dur, vol, pedal) {
    if (!f) return;
    if (!onda) onda = audio.createPeriodicWave(new Float32Array(8), new Float32Array([0, 1, .55, .3, .18, .1, .06, .03]));
    const osc = audio.createOscillator(), g = audio.createGain();
    osc.setPeriodicWave(onda); osc.frequency.value = f;
    const decae = Math.max(.6, 3.2 - f / 400);                        // las agudas se apagan antes
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .012);                    // ataque suave
    g.gain.setTargetAtTime(0, t + .012, decae / 3);                   // caída natural
    if (!pedal) g.gain.setTargetAtTime(0, t + dur, .06);              // sin pedal: se corta al soltar
    osc.connect(g); g.connect(out);
    osc.start(t); osc.stop(t + dur + (pedal ? 3.5 : .6));
    sources.push(osc);
  }
  // notas = [["E5", inicio, duración], ...] medidos en "tiempos" (1 tiempo = PARTITURA.tiempo segundos)
  function tocarPiano(out, notas, t0, { vol = .2, pedal = true } = {}) {
    for (const [n, ini, dur] of notas) notaPiano(out, freq(n), t0 + ini * PARTITURA.tiempo, dur * PARTITURA.tiempo, vol, pedal);
  }

  /* Escenario 2 · Parque: pieza de piano, en bucle (las notas se editan en PARTITURA, arriba) */
  function tocarElHonorato(out) {
    sources = [];
    const sala = conReverb(out, 0.3), t0 = audio.currentTime + .05;
    tocarPiano(sala, PARTITURA.manoDerecha, t0, { vol: .22 });
    tocarPiano(sala, PARTITURA.manoIzquierda, t0, { vol: .07 });
    later(() => tocarElHonorato(out), PARTITURA.repetirCada * 1000);
  }

  /* Escenario 3 · Mundo Minecraft: tema suave, en bucle */
  function tocarMelodiaMinecraft(out) {
    const melodia = [
      { f: 370.0, d: 0.6 }, { f: 440.0, d: 0.6 }, { f: 493.9, d: 0.6 }, { f: 587.3, d: 1.6 },
      { f: 0, d: 0.4 },
      { f: 370.0, d: 0.6 }, { f: 440.0, d: 0.6 }, { f: 493.9, d: 0.6 }, { f: 659.3, d: 1.6 },
      { f: 0, d: 0.4 },
      { f: 370.0, d: 0.6 }, { f: 440.0, d: 0.6 }, { f: 493.9, d: 0.6 }, { f: 587.3, d: 1.6 },
      { f: 554.4, d: 0.8 }, { f: 440.0, d: 0.8 }, { f: 370.0, d: 2.0 }
    ];
    const total = melodia.reduce((s, n) => s + n.d, 0), volumen = 0.3;
    const tocar = () => {
      sources = [];
      let t = audio.currentTime;
      melodia.forEach((nota) => {
        if (nota.f > 0) {
          const osc = audio.createOscillator(), g = audio.createGain();
          osc.type = "sine"; osc.frequency.value = nota.f;
          g.gain.setValueAtTime(volumen, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + nota.d);
          osc.connect(g); g.connect(out);
          osc.start(t); osc.stop(t + nota.d);
          sources.push(osc);
        }
        t += nota.d;
      });
      later(tocar, (total + 3) * 1000);
    };
    tocar();
  }

  /* Escenario 4 · Mirador: se toca al soplar la vela */
  function tocarFelizCumpleanos() {
    stop(.3);
    const out = newBus(1);
    const melodia = [
      { f: 261.6, d: 0.3 }, { f: 261.6, d: 0.1 }, { f: 293.7, d: 0.4 }, { f: 261.6, d: 0.4 }, { f: 349.2, d: 0.4 }, { f: 329.6, d: 0.8 },
      { f: 261.6, d: 0.3 }, { f: 261.6, d: 0.1 }, { f: 293.7, d: 0.4 }, { f: 261.6, d: 0.4 }, { f: 392.0, d: 0.4 }, { f: 349.2, d: 0.8 },
      { f: 261.6, d: 0.3 }, { f: 261.6, d: 0.1 }, { f: 523.3, d: 0.4 }, { f: 440.0, d: 0.4 }, { f: 349.2, d: 0.4 }, { f: 329.6, d: 0.4 }, { f: 293.7, d: 0.6 },
      { f: 466.2, d: 0.3 }, { f: 466.2, d: 0.1 }, { f: 440.0, d: 0.4 }, { f: 349.2, d: 0.4 }, { f: 392.0, d: 0.4 }, { f: 349.2, d: 0.8 }
    ];
    let t = audio.currentTime;
    melodia.forEach((nota) => {
      const osc = audio.createOscillator(), g = audio.createGain();
      osc.type = "triangle"; osc.frequency.value = nota.f;
      g.gain.setValueAtTime(0.1, t);
      osc.connect(g); g.connect(out);
      osc.start(t); osc.stop(t + nota.d - 0.05);
      t += nota.d;
    });
  }

  return {
    stop,
    play(n) {                                                      // música según el escenario
      stop(0.2);
      if (!audio) return;
      if (n === 0) iniciarAmbienteObra(newBus(1));
      else if (n === 1) tocarElHonorato(newBus(1));
      else if (n === 2) tocarMelodiaMinecraft(newBus(0.7));
    },
    birthday: tocarFelizCumpleanos
  };
})();
