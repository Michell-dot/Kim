/* Sprites pixel-art (img/*.png con fondo transparente) */
const SPRITE_SCALE = 0.56; // misma escala para todos los personajes
const sprites = {};
["player_idle", "player_walk", "gojo", "duxo", "worker0", "worker1", "worker2", "worker3", "worker4", "friend0", "friend1", "friend2", "friend3", "friend4"].forEach((n) => { const i = new Image(); i.src = `img/${n}.png`; sprites[n] = i; });

function drawSprite(img, cx, bottom, flip = false, k = SPRITE_SCALE) {
  if (!img.complete || !img.naturalWidth) return false;   // si no cargó, se usa el dibujo de respaldo
  const w = img.naturalWidth * k, h = img.naturalHeight * k;
  ctx.save();
  ctx.translate(cx, bottom);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
  return true;
}
function drawShadow(cx, y, w) {
  ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(cx, y, w, 6, 0, 0, 7); ctx.fill();
}
function drawPlayerSprite() {
  const moving = Math.abs(player.vx) > .5 || !player.grounded;
  const cx = player.x + player.width / 2, feet = player.y + player.height;
  const bob = moving && player.grounded ? -Math.abs(Math.sin(player.walkFrame)) * 4 : 0;
  drawShadow(cx, groundY + 4, 22);
  return drawSprite(sprites[moving ? "player_walk" : "player_idle"], cx, feet + bob, player.facing === -1);
}
function drawGojoSprite(x, py) {
  ctx.save();                                              // aura del "Infinito"
  ctx.strokeStyle = "rgba(56,189,248,.6)"; ctx.lineWidth = 3; ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.arc(x + 25, py + 50, 52 + Math.sin(time * 2) * 4, 0, 7); ctx.stroke();
  ctx.restore();
  drawShadow(x + 25, groundY + 4, 24);
  return drawSprite(sprites.gojo, x + 25, py + 88);
}

/* Obreros (hoja de sprites separada en worker0..4; arte 4x => escala 0.27) */
const WORKER_SCALE = 0.27;
function drawWorkerSprite(i, x, py) {                      // el chalán con diálogo (worker0)
  drawShadow(x + 25, groundY + 4, 24);
  return drawSprite(sprites["worker" + i], x + 25, py + 80, false, WORKER_SCALE);
}
function drawSiteWorkers() {                               // obreros decorativos de la obra
  [[2, 200], [1, 470], [4, 900], [3, 1090]].forEach(([i, cx], n) => {
    const bob = -Math.abs(Math.sin(time * 2 + n * 1.7)) * 3;
    const shake = i === 1 ? Math.sin(time * 45) * 1.2 : 0;  // el del taladro vibra
    drawShadow(cx, groundY + 4, 26);
    drawSprite(sprites["worker" + i], cx + shake, groundY + 2 + bob, false, WORKER_SCALE);
  });
}

/* Amigos en la escena final: celebran (saltan) cuando se sopla la vela */
function drawFriends() {
  [[0, 110], [1, 200], [2, 290], [3, 890], [4, 975]].forEach(([i, cx], n) => {
    const hop = ending.phase ? -Math.abs(Math.sin(time * 4 + n * 1.3)) * 16 : -Math.abs(Math.sin(time * 1.5 + n)) * 2;
    drawShadow(cx, groundY + 4, 24);
    drawSprite(sprites["friend" + i], cx, groundY + 2 + hop);
  });
}
