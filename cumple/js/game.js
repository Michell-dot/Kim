/* Lógica del juego: estado, input, física, transiciones, cinemática final */
const canvas = $("gameCanvas"), ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const stage = $("stage"), dialogueBox = $("dialogueBox"), sceneTitle = $("sceneTitle");
const bigMsg = $("bigCenterMessage"), iris = $("iris"), irisText = $("irisText");

let currentScene = 0, isTransitioning = false, candleLit = true, sunsetProgress = 0, time = 0, started = false;
const cam = { x: W / 2, y: H / 2, z: 1 };
const ending = { phase: 0, t0: 0, msg: 0, photo: 0, smoke: [] };

const player = {
  x: 100, y: groundY - 75, width: 44, height: 75, vx: 0, vy: 0, speed: 5.5,
  jumping: false, grounded: false, facing: 1, walkFrame: 0, coyote: 0, buffer: 0
};

const particles = Array.from({ length: 45 }, () => ({
  x: Math.random() * W, y: Math.random() * H, r: Math.random() * 4 + 3,
  vx: (Math.random() - .5) * 1.5, vy: Math.random() * 1.5 + .5,
  color: ["#7dd3fc", "#f472b6", "#fde047", "#c084fc"][Math.floor(Math.random() * 4)]
}));
const sceneDrawers = [drawScene0_Construction, drawScene1_Sakura, drawScene2_Minecraft, drawScene3_Mirador];

/* ---------- Input ---------- */
const keys = { left: false, right: false, jump: false };
const KEYMAP = { ArrowRight: "right", KeyD: "right", ArrowLeft: "left", KeyA: "left", Space: "jump", ArrowUp: "jump", KeyW: "jump" };

function start() {
  if (started) return;
  started = true;
  audio = new (window.AudioContext || window.webkitAudioContext)();
  $("startScreen").classList.add("hide");
  jingle([523, 659, 784, 1047]);
  Sound.play(0);
}
function press(k) { if (k === "jump" && !keys.jump) player.buffer = 6; keys[k] = true; }

addEventListener("keydown", (e) => {
  if (!started) { start(); return; }
  const k = KEYMAP[e.code];
  if (k) { e.preventDefault(); press(k); }
  if (e.code === "KeyS" || e.code === "Enter") tryBlowCandle();
});
addEventListener("keyup", (e) => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
$("startScreen").addEventListener("pointerdown", start);

document.querySelectorAll("[data-k]").forEach((b) => {
  const k = b.dataset.k;
  b.addEventListener("pointerdown", (e) => { e.preventDefault(); k === "blow" ? tryBlowCandle() : press(k); });
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => b.addEventListener(ev, () => { if (k !== "blow") keys[k] = false; }));
});

/* ---------- Transición de escenario (iris estilo Mario) ---------- */
function setIris(open) {
  const px = (player.x + player.width / 2) / W * 100, py = (player.y + player.height / 2) / H * 100;
  const r = open * 150;
  iris.style.background = `radial-gradient(circle at ${px}% ${py}%, transparent ${r}vmax, #0b1020 ${r}vmax)`;
}
async function changeScene(next) {
  if (isTransitioning) return;
  isTransitioning = true;
  player.vx = 0;
  dialogueBox.style.display = "none";
  jingle([784, 659, 523]);
  Sound.stop();
  await tween(750, (k) => setIris(1 - k));
  currentScene = next;
  Sound.play(next);
  sceneTitle.textContent = scenes[next].title;
  Object.assign(player, { x: 70, y: groundY - player.height, vy: 0, grounded: true });
  irisText.textContent = scenes[next].title;
  irisText.classList.add("show");
  await wait(1100);
  irisText.classList.remove("show");
  await wait(300);
  await tween(850, (k) => setIris(k));
  iris.style.background = "transparent";
  isTransitioning = false;
}

/* ---------- Cinemática final ---------- */
function tryBlowCandle() {
  if (currentScene !== 3 || !candleLit || ending.phase || Math.abs(player.x - W / 2) > 220) return;
  candleLit = false;
  ending.phase = 1; ending.t0 = performance.now();
  stage.classList.add("cinematic");
  dialogueBox.style.display = "none";
  for (let i = 0; i < 16; i++) ending.smoke.push({ x: W / 2, y: groundY - 185, vy: -.6 - Math.random(), ph: Math.random() * 6, a: .8, r: 4 });
  Sound.birthday();
}
function updateEnding() {
  if (!ending.phase) return;
  const t = performance.now() - ending.t0, cx = W / 2, cy = groundY - 150, ZOOM = 3.2;
  if (t < 1800) {                       // 1. Acercamiento a la vela
    const k = easeInOut(t / 1800);
    cam.z = 1 + (ZOOM - 1) * k; cam.x = W / 2 + (cx - W / 2) * k; cam.y = H / 2 + (cy - H / 2) * k;
  } else if (t < 8000) {                // 2. Mensaje
    cam.z = ZOOM; cam.x = cx; cam.y = cy;
  } else {                              // 3. La cámara se aleja al atardecer
    const k = easeInOut(clamp01((t - 8000) / 7000));
    cam.z = ZOOM - (ZOOM - 1) * k; cam.x = cx + (W / 2 - cx) * k; cam.y = cy + (H / 2 - cy) * k;
  }
  sunsetProgress = easeInOut(clamp01((t - 1500) / 13000));
  if (t > 2400 && !ending.msg) { ending.msg = 1; bigMsg.classList.add("visible"); }
  if (t > 7600 && ending.msg === 1) { ending.msg = 2; bigMsg.classList.remove("visible"); }
  if (t > 12500 && !ending.photo) { ending.photo = 1; $("finalPhoto")?.classList.add("show"); }
  if (t > 17000 && ending.photo === 1) { ending.photo = 2; $("finalCaption").classList.add("show"); }
  for (const s of ending.smoke) { s.y += s.vy; s.x += Math.sin(time * 2 + s.ph) * .6; s.r += .25; s.a -= .006; }
  ending.smoke = ending.smoke.filter((s) => s.a > 0);
}

/* ---------- Actualización ---------- */
function updatePlayer() {
  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.vx += (dir * player.speed - player.vx) * (dir ? .25 : .3);
  if (dir) { player.facing = dir; player.walkFrame += .22; }
  else if (Math.abs(player.vx) < .1) { player.vx = 0; player.walkFrame = 0; }

  player.buffer = Math.max(0, player.buffer - 1);
  player.coyote = player.grounded ? 6 : player.coyote - 1;       // "coyote time"
  if (player.buffer > 0 && player.coyote > 0) {                  // salto con buffer
    player.vy = -13.5; player.coyote = 0; player.buffer = 0; player.jumping = true;
    beep(440, .15, "square", .04); beep(660, .12, "square", .04, .06);
  }
  player.vy += keys.jump || player.vy > 0 ? .58 : 1.4;           // salto variable
  const prevBottom = player.y + player.height;
  player.x += player.vx; player.y += player.vy;
  player.grounded = false;

  for (const p of scenes[currentScene].platforms) {
    if (player.vy >= 0 && prevBottom <= p.y + 8 && player.y + player.height >= p.y &&
      player.x + player.width > p.x + 6 && player.x < p.x + p.w - 6) {
      player.y = p.y - player.height; player.vy = 0; player.grounded = true;
    }
  }
  if (player.y + player.height >= groundY) { player.y = groundY - player.height; player.vy = 0; player.grounded = true; }
  if (player.grounded) player.jumping = false;

  player.x = Math.max(20, player.x);
  if (player.x > W - 60) {
    if (currentScene < scenes.length - 1) changeScene(currentScene + 1);
    else player.x = W - 60;
  }
}

let dlgId = null, dlgN = 0, dlgEl = null;
function showDialogue(id, name, msg) {
  if (dlgId !== id) {
    dlgId = id; dlgN = 0;
    dialogueBox.innerHTML = `<div class="speaker-name"></div><br><span></span>`;
    dialogueBox.firstChild.textContent = name; dlgEl = dialogueBox.lastChild;
  }
  dlgN = Math.min(msg.length, dlgN + 1.4);                      // efecto máquina de escribir
  dlgEl.textContent = msg.slice(0, dlgN | 0);
  dialogueBox.style.display = "block";
  if ((dlgN | 0) % 3 === 0 && dlgN < msg.length) beep(700 + Math.random() * 120, .03, "square", .015);
}
function checkDialogues() {
  const sc = scenes[currentScene], cxp = player.x + player.width / 2;
  if (!ending.phase) {
    if (sc.npc && Math.abs(cxp - (sc.npc.x + sc.npc.w / 2)) < 130) return showDialogue(currentScene, sc.npc.name, sc.npc.msg);
    if (currentScene === 3 && Math.abs(cxp - W / 2) < 200 && candleLit)
      return showDialogue("cake", "🎉 ¡Todos juntos en el Mirador! 🎉", "¡Pide un deseo por tus 20 años y presiona 'S' o 'ENTER' para soplar la vela!");
  }
  dlgId = null; dialogueBox.style.display = "none";
}

function update() {
  time += .05;
  for (const pt of particles) {
    pt.x += pt.vx; pt.y += pt.vy;
    if (pt.y > H) { pt.y = -10; pt.x = Math.random() * W; }
    if (pt.x > W) pt.x = 0; if (pt.x < 0) pt.x = W;
  }
  if (!started) return;
  updateEnding();
  if (isTransitioning || ending.phase) { player.vx = 0; return; }
  updatePlayer();
  checkDialogues();
}

/* ---------- Render ---------- */
function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(RES, 0, 0, RES, 0, 0);
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);

  drawSkyAndMountains();
  sceneDrawers[currentScene]();
  drawPlatforms();
  if (currentScene === 0) drawSiteWorkers();
  const npc = scenes[currentScene].npc;
  if (npc) drawNPCCharacter(npc.x, npc.y, npc.type);

  if (currentScene < 3 && !isTransitioning) {                   // indicador "siguiente"
    const bx = Math.sin(time * 3) * 6;
    ctx.fillStyle = "rgba(15,23,42,.7)"; ctx.beginPath(); ctx.roundRect(W - 155 + bx, groundY - 95, 140, 42, 10); ctx.fill();
    ctx.fillStyle = "#7dd3fc"; ctx.font = "bold 16px sans-serif"; ctx.fillText("Siguiente ➡️", W - 135 + bx, groundY - 68);
  }
  drawPlayer();
  for (const s of ending.smoke) { ctx.fillStyle = `rgba(226,232,240,${s.a})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }
  ctx.restore();
}

/* ---------- Bucle con paso fijo (60 FPS estables en cualquier pantalla) ---------- */
let last = performance.now(), acc = 0;
function loop(now) {
  acc += Math.min(100, now - last); last = now;
  while (acc >= 1000 / 60) { update(); acc -= 1000 / 60; }
  draw();
  requestAnimationFrame(loop);
}
sceneTitle.textContent = scenes[0].title;
requestAnimationFrame(loop);
