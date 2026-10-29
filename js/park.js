/* Escenario 2: Parque de cerezos (fondo pintado img/parque.jpg) */
const parkBg = new Image();
parkBg.src = "img/parque.jpg";

function drawScene1_Sakura() {
  if (!parkBg.complete || !parkBg.naturalWidth) return drawScene1_Park();   // respaldo si no carga
  ctx.imageSmoothingEnabled = true;                                         // la pintura se ve mejor suave
  ctx.drawImage(parkBg, 0, 0, W, H);
  ctx.imageSmoothingEnabled = false;
  const g = ctx.createLinearGradient(0, groundY - 60, 0, H);                // oscurece el suelo para que resalten los personajes
  g.addColorStop(0, "rgba(20,40,10,0)"); g.addColorStop(1, "rgba(20,40,10,.35)");
  ctx.fillStyle = g; ctx.fillRect(0, groundY - 60, W, H - groundY + 60);
  ctx.fillStyle = "rgba(255,214,232,.85)";                                  // pétalos cayendo
  for (const pt of particles) {
    ctx.beginPath(); ctx.ellipse(pt.x, pt.y, pt.r * 1.4, pt.r * .7, time + pt.x * .01, 0, 7); ctx.fill();
  }
}
