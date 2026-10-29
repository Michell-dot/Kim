/* Constantes y utilidades */
const W = 1280, H = 720, groundY = H - 110;
const RES = 0.5; // resolución interna del canvas (0.5 = pixel-art retro)
const $ = (id) => document.getElementById(id);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeInOut = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const tween = (ms, fn, ease = easeInOut) => new Promise((res) => {
  const t0 = performance.now();
  (function f(t) { const k = clamp01((t - t0) / ms); fn(ease(k)); k < 1 ? requestAnimationFrame(f) : res(); })(t0);
});

/* Sonido chiptune (WebAudio, sin archivos) */
let audio = null;
function beep(freq, dur = .1, type = "square", vol = .05, delay = 0) {
  if (!audio) return;
  const t = audio.currentTime + delay, o = audio.createOscillator(), g = audio.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dur);
}
const jingle = (notes, type = "square") => notes.forEach((f, i) => beep(f, .2, type, .05, i * .15));

// Utilidad para mezclar colores en el atardecer
        function lerpColor(a, b, amount) {
            const ah = parseInt(a.replace(/#/g, ''), 16),
                ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
                bh = parseInt(b.replace(/#/g, ''), 16),
                br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
                rr = ar + amount * (br - ar),
                rg = ag + amount * (bg - ag),
                rb = ab + amount * (bb - ab);
            return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
        }
