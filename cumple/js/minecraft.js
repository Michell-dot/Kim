/* Escenario 3: Mundo Minecraft (bloques de 40px) */
const hsh = (a, b) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); };

function mcBlock(c, x, y, s, base, top, seed = 0) {
  c.fillStyle = base; c.fillRect(x, y, s, s);
  const n = s / 4;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {            // textura con ruido
    const r = hsh(x / n + i + seed, y / n + j);
    if (r < .33) { c.fillStyle = "rgba(0,0,0,.15)"; c.fillRect(x + i * n, y + j * n, n, n); }
    else if (r > .7) { c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(x + i * n, y + j * n, n, n); }
  }
  if (top) {                                                           // pasto con flecos
    c.fillStyle = top; c.fillRect(x, y, s, s * .3);
    for (let i = 0; i < 4; i++) if (hsh(x / n + i, y) > .5) c.fillRect(x + i * n, y + s * .3, n, n * .8);
  }
  c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1.5; c.strokeRect(x, y, s, s);
}

let mcLayer = null;
function buildMC() {                                                   // capa estática, se dibuja una sola vez
  mcLayer = document.createElement("canvas"); mcLayer.width = W; mcLayer.height = H;
  const c = mcLayer.getContext("2d");
  for (let i = 0; i < 32; i++) {                                       // colinas de bloques
    const rows = Math.max(1, Math.round(2.2 + 1.4 * Math.sin(i * .6 + 1) + .8 * Math.sin(i * 1.9)));
    for (let r = 0; r < rows; r++) mcBlock(c, i * 40, groundY - (r + 1) * 40, 40, "#8a5a33", r === rows - 1 ? "#4b8f2a" : null, 3);
  }
  c.globalCompositeOperation = "source-atop"; c.fillStyle = "rgba(122,184,255,.3)"; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = "source-over";
  for (const tx of [120, 560, 1160]) {                                 // árboles
    for (let k = 1; k <= 3; k++) mcBlock(c, tx, groundY - k * 40, 40, "#6b4a2b", null, tx + k);
    for (let a = -1; a <= 1; a++) for (let b = 0; b < 2; b++) mcBlock(c, tx + a * 40, groundY - 160 - b * 40, 40, "#3f8f2a", null, a + b * 5);
    mcBlock(c, tx, groundY - 240, 40, "#3f8f2a", null, 7);
  }
  for (let i = 0; i < 32; i++) for (let r = 0; r < 3; r++)             // suelo
    mcBlock(c, i * 40, groundY + r * 40, 40, r < 2 ? "#8a5a33" : "#7d7d7d", r === 0 ? "#5aa832" : null, i + r * 9);
  for (const [i, r] of [[4, 1], [13, 2], [24, 1], [29, 2]]) {          // diamantes
    c.fillStyle = "#5eead4"; c.fillRect(i * 40 + 8, groundY + r * 40 + 8, 10, 10); c.fillRect(i * 40 + 22, groundY + r * 40 + 22, 10, 10);
  }
}

function drawScene2_Minecraft() {
  if (!mcLayer) buildMC();
  ctx.fillStyle = "#7ab8ff"; ctx.fillRect(0, 0, W, groundY);
  ctx.fillStyle = "#a8d2ff"; ctx.fillRect(0, groundY - 300, W, 300);
  ctx.fillStyle = "#fff6a8"; ctx.fillRect(590, 70, 100, 100);          // sol cuadrado
  ctx.fillStyle = "#ffe55c"; ctx.fillRect(605, 85, 70, 70);
  ctx.fillStyle = "rgba(255,255,255,.95)";                             // nubes de bloques
  for (let i = 0; i < 5; i++) {
    const x = ((i * 330 + time * 10) % (W + 280)) - 140, y = 60 + (i % 3) * 50;
    ctx.fillRect(x, y, 160, 32); ctx.fillRect(x + 30, y - 24, 90, 24);
  }
  ctx.drawImage(mcLayer, 0, 0);
}

function drawMCPlatform(p) {
  const n = Math.max(1, Math.round(p.w / 40)), tw = p.w / n;
  for (let i = 0; i < n; i++) mcBlock(ctx, p.x + i * tw, p.y, tw, "#8a5a33", "#5aa832", i);
}

function drawDuxoBlocky(x, py) {
  drawShadow(x + 25, groundY + 4, 24);
  if (drawSprite(sprites.duxo, x + 25, py + 88)) return true;   // sprite de Duxo
  const c = ctx;                                                // respaldo en bloques
  c.fillStyle = "#1e293b"; c.fillRect(x + 12, py + 54, 12, 24); c.fillRect(x + 26, py + 54, 12, 24);
  c.fillStyle = "#fed7aa"; c.fillRect(x + 2, py + 28, 10, 26); c.fillRect(x + 38, py + 28, 10, 26);
  c.fillStyle = "#7e22ce"; c.fillRect(x + 12, py + 28, 26, 28);
  c.fillStyle = "#fed7aa"; c.fillRect(x + 10, py, 30, 28);
  c.fillStyle = "#3b2418"; c.fillRect(x + 10, py, 30, 9);
  c.fillStyle = "#fff"; c.fillRect(x + 15, py + 14, 8, 6); c.fillRect(x + 27, py + 14, 8, 6);
  c.fillStyle = "#2563eb"; c.fillRect(x + 19, py + 14, 4, 6); c.fillRect(x + 31, py + 14, 4, 6);
  c.fillStyle = "#a0522d"; c.fillRect(x + 20, py + 23, 10, 3);
  c.fillStyle = "#38bdf8"; c.fillRect(x + 6, py + 6, 6, 16); c.fillRect(x + 38, py + 6, 6, 16); c.fillRect(x + 8, py - 3, 34, 5);
  c.strokeStyle = "rgba(0,0,0,.5)"; c.lineWidth = 2; c.strokeRect(x + 10, py, 30, 28); c.strokeRect(x + 12, py + 28, 26, 28);
  return true;
}
