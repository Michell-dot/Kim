/* Dibujo de escenarios y personajes (coordenadas lógicas 1280x720) */
// ==================== FUNCIONES DE DIBUJO DE ESCENARIOS ====================

        function drawSkyAndMountains() {
            // Interpolación entre cielo celeste hermoso y atardecer dorado/rosado
            const grad = ctx.createLinearGradient(0, 0, 0, groundY);
            if (sunsetProgress === 0) {
                grad.addColorStop(0, "#38bdf8");   // Celeste intenso arriba
                grad.addColorStop(0.6, "#bae6fd"); // Celeste pastel medio
                grad.addColorStop(1, "#e0f2fe");   // Blanco celeste abajo
            } else {
                grad.addColorStop(0, lerpColor("#38bdf8", "#1e1b4b", sunsetProgress));
                grad.addColorStop(0.45, lerpColor("#bae6fd", "#be185d", sunsetProgress));
                grad.addColorStop(0.8, lerpColor("#e0f2fe", "#f97316", sunsetProgress));
                grad.addColorStop(1, lerpColor("#e0f2fe", "#fde047", sunsetProgress));
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, groundY);

            // Sol / Sol de atardecer
            const sunY = 130 + sunsetProgress * 240;
            const sunColor = sunsetProgress > 0.3 ? "#fde047" : "#fef08a";
            ctx.save();
            ctx.fillStyle = sunColor;
            ctx.shadowColor = sunsetProgress > 0.3 ? "#f97316" : "#fef08a";
            ctx.shadowBlur = 45;
            ctx.beginPath();
            ctx.arc(W / 2, sunY, 55 + sunsetProgress * 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Nubes suaves
            ctx.fillStyle = sunsetProgress > 0.4 ? "rgba(253, 186, 116, 0.45)" : "rgba(255, 255, 255, 0.75)";
            drawCloud(220 + Math.sin(time * 0.2) * 20, 110, 1.1);
            drawCloud(680 + Math.cos(time * 0.15) * 25, 85, 0.9);
            drawCloud(1020 + Math.sin(time * 0.25) * 15, 130, 1.2);

            // Montañas lejanas (siempre visibles para dar vista bonita)
            ctx.fillStyle = lerpColor("#7dd3fc", "#311042", sunsetProgress);
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(200, 340);
            ctx.lineTo(430, 470);
            ctx.lineTo(720, 300);
            ctx.lineTo(1000, 450);
            ctx.lineTo(1280, 320);
            ctx.lineTo(1280, groundY);
            ctx.fill();

            // Montañas cercanas
            ctx.fillStyle = lerpColor("#38bdf8", "#4c1d95", sunsetProgress);
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(140, 440);
            ctx.lineTo(380, 370);
            ctx.lineTo(620, 490);
            ctx.lineTo(910, 360);
            ctx.lineTo(1280, 470);
            ctx.lineTo(1280, groundY);
            ctx.fill();
        }

        function drawCloud(x, y, s) {
            ctx.beginPath();
            ctx.arc(x, y, 28 * s, 0, Math.PI * 2);
            ctx.arc(x + 25 * s, y - 10 * s, 35 * s, 0, Math.PI * 2);
            ctx.arc(x + 55 * s, y, 26 * s, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawScene0_Construction() {
            // Grúa torre al fondo
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 6;
            ctx.strokeRect(180, 140, 36, groundY - 140);
            ctx.beginPath();
            ctx.moveTo(120, 150);
            ctx.lineTo(520, 150);
            ctx.stroke();
            // Cable de grúa
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(430, 150);
            ctx.lineTo(430, 260);
            ctx.stroke();

            // Estructura de edificio en construcción
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(580, 270, 240, groundY - 270);
            ctx.fillStyle = "#cbd5e1";
            for (let r = 300; r < groundY - 50; r += 65) {
                for (let c = 605; c < 790; c += 60) {
                    ctx.fillRect(c, r, 42, 42);
                }
            }

            // Cartel de Obra de Ingeniería
            ctx.fillStyle = "#334155";
            ctx.fillRect(960, groundY - 140, 8, 140);
            ctx.fillRect(1140, groundY - 140, 8, 140);
            ctx.fillStyle = "#0284c7";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
            ctx.fillRect(930, groundY - 210, 245, 95);
            ctx.strokeRect(930, groundY - 210, 245, 95);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("PROYECTO CIVIL:", 955, groundY - 175);
            ctx.fillStyle = "#fde047";
            ctx.font = "bold 18px sans-serif";
            ctx.fillText("INGENIERA - 20 AÑOS", 955, groundY - 148);

            // Conos de seguridad
            drawCone(350, groundY);
            drawCone(850, groundY);

            // Suelo de obra
            ctx.fillStyle = "#64748b";
            ctx.fillRect(0, groundY, W, H - groundY);
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(0, groundY, W, 12);
        }

        function drawCone(x, y) {
            ctx.fillStyle = "#f97316";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 14, y - 34);
            ctx.lineTo(x + 28, y);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x + 7, y - 20, 14, 6);
        }

        function drawScene1_Park() {
            // Lago celeste brillante al fondo
            ctx.fillStyle = "#0284c7";
            ctx.fillRect(0, groundY - 45, W, 45);
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.fillRect(180, groundY - 30, 120, 4);
            ctx.fillRect(720, groundY - 22, 160, 4);

            // Árboles de cerezo (Sakura) y árboles celestes/verdes
            drawTree(170, groundY, "#f472b6", "#fbcfe8");
            drawTree(560, groundY, "#38bdf8", "#bae6fd");
            drawTree(980, groundY, "#f472b6", "#fbcfe8");

            // Banca de parque
            ctx.fillStyle = "#78350f";
            ctx.fillRect(370, groundY - 32, 95, 10);
            ctx.fillRect(370, groundY - 48, 95, 12);
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(382, groundY - 22, 8, 22);
            ctx.fillRect(445, groundY - 22, 8, 22);

            // Suelo de pasto esmeralda
            ctx.fillStyle = "#15803d";
            ctx.fillRect(0, groundY, W, H - groundY);
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(0, groundY, W, 16);

            // Pétalos flotando
            ctx.fillStyle = "#fbcfe8";
            for (let pt of particles) {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawTree(x, y, c1, c2) {
            ctx.fillStyle = "#5c4033";
            ctx.fillRect(x - 14, y - 130, 28, 130);
            ctx.fillStyle = c1;
            ctx.beginPath();
            ctx.arc(x, y - 165, 65, 0, Math.PI * 2);
            ctx.arc(x - 45, y - 135, 50, 0, Math.PI * 2);
            ctx.arc(x + 45, y - 135, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = c2;
            ctx.beginPath();
            ctx.arc(x - 15, y - 180, 40, 0, Math.PI * 2);
            ctx.arc(x + 25, y - 155, 35, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawScene2_DuxoStreet() {
            // Edificios urbanos modernos
            const blds = [
                { x: 60, w: 180, h: 340, c: "#1e293b" },
                { x: 260, w: 210, h: 270, c: "#334155" },
                { x: 500, w: 250, h: 380, c: "#1e1b4b" },
                { x: 780, w: 200, h: 300, c: "#334155" },
                { x: 1010, w: 210, h: 350, c: "#1e293b" }
            ];
            for (let b of blds) {
                ctx.fillStyle = b.c;
                ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
                // Ventanas iluminadas
                ctx.fillStyle = "#7dd3fc";
                for (let wy = groundY - b.h + 30; wy < groundY - 70; wy += 48) {
                    for (let wx = b.x + 22; wx < b.x + b.w - 30; wx += 45) {
                        ctx.fillRect(wx, wy, 24, 28);
                    }
                }
            }

            // Cartel Neón gigante de Duxo
            ctx.save();
            ctx.fillStyle = "#2e1065";
            ctx.strokeStyle = "#c084fc";
            ctx.lineWidth = 5;
            ctx.shadowColor = "#a855f7";
            ctx.shadowBlur = 20;
            ctx.fillRect(525, groundY - 330, 200, 90);
            ctx.strokeRect(525, groundY - 330, 200, 90);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText("🎮 DUXORETHEY", 545, groundY - 290);
            ctx.fillStyle = "#7dd3fc";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("¡FELICES 20!", 570, groundY - 260);
            ctx.restore();

            // Farolas de calle
            for (let lx of [200, 620, 960]) {
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(lx, groundY - 160, 8, 160);
                ctx.fillStyle = "#fef08a";
                ctx.beginPath();
                ctx.arc(lx + 4, groundY - 165, 14, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pista y vereda
            ctx.fillStyle = "#334155";
            ctx.fillRect(0, groundY, W, H - groundY);
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(0, groundY, W, 16);
        }

        function drawScene3_Mirador() {
            // Lago panorámico al pie de las montañas
            const lakeGrad = ctx.createLinearGradient(0, groundY - 140, 0, groundY);
            lakeGrad.addColorStop(0, lerpColor("#0284c7", "#c2410c", sunsetProgress));
            lakeGrad.addColorStop(1, lerpColor("#7dd3fc", "#fde047", sunsetProgress));
            ctx.fillStyle = lakeGrad;
            ctx.fillRect(0, groundY - 120, W, 120);

            // Baranda elegante del Mirador (Madera y piedra)
            ctx.fillStyle = "#78350f";
            ctx.fillRect(0, groundY - 68, W, 12);
            ctx.fillRect(0, groundY - 38, W, 8);
            for (let rx = 40; rx < W; rx += 90) {
                ctx.fillStyle = "#451a03";
                ctx.fillRect(rx, groundY - 75, 16, 75);
            }

            // Guirnaldas festivas celestes y doradas en el cielo
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(150, 90);
            ctx.quadraticCurveTo(W / 2, 190, W - 150, 90);
            ctx.stroke();

            // Piso de madera del mirador
            ctx.fillStyle = "#451a03";
            ctx.fillRect(0, groundY, W, H - groundY);
            ctx.fillStyle = "#78350f";
            ctx.fillRect(0, groundY, W, 16);

            // Todos los personajes reunidos alrededor de la torta
            drawNPCCharacter(370, groundY - 78, "chalan");
            drawNPCCharacter(460, groundY - 85, "gojo");
            drawNPCCharacter(770, groundY - 78, "duxo");
            
            
            drawFriends();

            // Mesa y Gran Torta de 20 Años en el centro (x = 640)
            const cx = W / 2;
            // Mesa
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(cx - 85, groundY - 45, 170, 45);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(cx - 90, groundY - 52, 180, 12);

            // Torta de 2 pisos celeste y blanca
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(cx - 60, groundY - 105, 120, 53);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(cx - 60, groundY - 105, 120, 14);

            ctx.fillStyle = "#e0f2fe";
            ctx.fillRect(cx - 42, groundY - 145, 84, 40);
            ctx.fillStyle = "#0284c7";
            ctx.fillRect(cx - 42, groundY - 145, 84, 12);

            // Número 20 en la torta
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 26px sans-serif";
            ctx.fillText("20", cx - 16, groundY - 68);

            // Vela
            ctx.fillStyle = "#fde047";
            ctx.fillRect(cx - 5, groundY - 172, 10, 27);
            if (candleLit) {
                ctx.save();
                ctx.fillStyle = "#f97316";
                ctx.shadowColor = "#fde047";
                ctx.shadowBlur = 18;
                ctx.beginPath();
                ctx.arc(cx, groundY - 182 + Math.sin(time * 3) * 2, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                // Estrellas / Luciérnagas mágicas en el atardecer
                for (let pt of particles) {
                    ctx.fillStyle = pt.color;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // ==================== DIBUJO DE PLATAFORMAS Y PERSONAJES ====================

        function drawPlatforms() {
            const plats = scenes[currentScene].platforms;
            for (let p of plats) {
 if (p.type === "block") { drawMCPlatform(p); continue; }
                if (p.type === "beam") {
                    ctx.fillStyle = "#ef4444"; // Viga de acero roja/naranja
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    ctx.fillStyle = "#991b1b";
                    ctx.fillRect(p.x, p.y + 5, p.w, 8);
                } else if (p.type === "wood") {
                    ctx.fillStyle = "#92400e";
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    ctx.fillStyle = "#4ade80";
                    ctx.fillRect(p.x, p.y, p.w, 6);
                } else if (p.type === "neon") {
                    ctx.fillStyle = "#1e1b4b";
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    ctx.strokeStyle = "#38bdf8";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(p.x, p.y, p.w, p.h);
                }
            }
        }

        // Dibuja a tu novia con cabello largo, ropa celeste y casco de ingeniera
        function drawPlayer() {
 if (drawPlayerSprite()) return;
            const x = player.x;
            const y = player.y;
            const legOffset = Math.sin(player.walkFrame) * 6;

            ctx.save();
            // Piernas animadas
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(x + 12, y + 52, 8, 23 + legOffset);
            ctx.fillRect(x + 24, y + 52, 8, 23 - legOffset);

            // Cabello largo detrás
            ctx.fillStyle = "#271c19";
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 12, 36, 36, 10);
            ctx.fill();

            // Cuerpo / Vestido o chaqueta celeste
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.roundRect(x + 8, y + 30, 28, 28, 8);
            ctx.fill();

            // Chaleco reflectante sutil de ingeniera
            ctx.fillStyle = "#fde047";
            ctx.fillRect(x + 11, y + 32, 4, 24);
            ctx.fillRect(x + 29, y + 32, 4, 24);

            // Cabeza
            ctx.fillStyle = "#fed7aa";
            ctx.beginPath();
            ctx.arc(x + 22, y + 18, 14, 0, Math.PI * 2);
            ctx.fill();

            // Ojos tiernos y sonrisa
            const eyeX = player.facing === 1 ? x + 24 : x + 14;
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(eyeX, y + 18, 2.3, 0, Math.PI * 2);
            ctx.arc(eyeX + 6, y + 18, 2.3, 0, Math.PI * 2);
            ctx.fill();
            // Mejillas rosadas
            ctx.fillStyle = "#f472b6";
            ctx.beginPath();
            ctx.arc(eyeX - 2, y + 22, 2.5, 0, Math.PI * 2);
            ctx.arc(eyeX + 8, y + 22, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Casco de Ingeniera Civil (Blanco con franja celeste)
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + 22, y + 11, 15, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = "#0284c7";
            ctx.fillRect(x + 5, y + 9, 34, 4);
            ctx.restore();
        }

        function drawNPCCharacter(x, y, type) {
            const bounce = !candleLit ? Math.abs(Math.sin(time * 2 + x)) * 8 : 0;
            const py = y - bounce;
 if (type === "gojo" && drawGojoSprite(x, py)) return;
 if (type === "chalan" && drawWorkerSprite(0, x, py)) return;
 if (type === "duxo" && drawDuxoBlocky(x, py)) return;

            ctx.save();
            if (type === "chalan") {
                // Piernas
                ctx.fillStyle = "#1e3a8a";
                ctx.fillRect(x + 12, py + 52, 10, 26);
                ctx.fillRect(x + 26, py + 52, 10, 26);
                // Cuerpo con chaleco naranja de obra
                ctx.fillStyle = "#f97316";
                ctx.beginPath();
                ctx.roundRect(x + 8, py + 28, 32, 28, 6);
                ctx.fill();
                // Cintas reflectivas
                ctx.fillStyle = "#fde047";
                ctx.fillRect(x + 8, py + 42, 32, 5);
                // Cabeza
                ctx.fillStyle = "#fdba74";
                ctx.beginPath();
                ctx.arc(x + 24, py + 16, 14, 0, Math.PI * 2);
                ctx.fill();
                // Casco amarillo
                ctx.fillStyle = "#facc15";
                ctx.beginPath();
                ctx.arc(x + 24, py + 11, 15, Math.PI, 0);
                ctx.fill();
                ctx.fillRect(x + 6, py + 10, 36, 4);
                // Plano en la mano
                ctx.fillStyle = "#38bdf8";
                ctx.fillRect(x - 4, py + 34, 14, 6);
            }
            else if (type === "gojo") {
                // Aura del Infinito (Celeste brillante alrededor de Gojo)
                ctx.save();
                ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
                ctx.lineWidth = 3;
                ctx.shadowColor = "#38bdf8";
                ctx.shadowBlur = 18;
                ctx.beginPath();
                ctx.arc(x + 25, py + 42, 42 + Math.sin(time * 2) * 4, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                // Cuerpo uniforme negro Jujutsu
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(x + 13, py + 55, 10, 30);
                ctx.fillRect(x + 27, py + 55, 10, 30);
                ctx.beginPath();
                ctx.roundRect(x + 9, py + 28, 32, 32, 6);
                ctx.fill();
                // Cuello alto
                ctx.fillRect(x + 15, py + 20, 20, 10);

                // Cabeza
                ctx.fillStyle = "#ffedd5";
                ctx.beginPath();
                ctx.arc(x + 25, py + 14, 14, 0, Math.PI * 2);
                ctx.fill();

                // Venda negra / Lentes de Gojo y destello de los Seis Ojos
                ctx.fillStyle = "#090d16";
                ctx.fillRect(x + 11, py + 9, 28, 8);
                ctx.fillStyle = "#38bdf8";
                ctx.fillRect(x + 15, py + 12, 6, 3);
                ctx.fillRect(x + 28, py + 12, 6, 3);

                // Cabello blanco en puntas icónico de Gojo
                ctx.fillStyle = "#f8fafc";
                ctx.beginPath();
                ctx.moveTo(x + 8, py + 10);
                ctx.lineTo(x + 4, py - 6);
                ctx.lineTo(x + 16, py + 2);
                ctx.lineTo(x + 25, py - 11);
                ctx.lineTo(x + 34, py + 2);
                ctx.lineTo(x + 46, py - 6);
                ctx.lineTo(x + 42, py + 10);
                ctx.closePath();
                ctx.fill();
            }
            else if (type === "duxo") {
                // Piernas
                ctx.fillStyle = "#1e293b";
                ctx.fillRect(x + 12, py + 52, 10, 26);
                ctx.fillRect(x + 26, py + 52, 10, 26);
                // Polera morada gamer
                ctx.fillStyle = "#7e22ce";
                ctx.beginPath();
                ctx.roundRect(x + 8, py + 28, 32, 28, 8);
                ctx.fill();
                // Cabeza
                ctx.fillStyle = "#fed7aa";
                ctx.beginPath();
                ctx.arc(x + 24, py + 16, 14, 0, Math.PI * 2);
                ctx.fill();
                // Cabello castaño oscuro
                ctx.fillStyle = "#271c19";
                ctx.beginPath();
                ctx.arc(x + 24, py + 12, 14, Math.PI, 0);
                ctx.fill();
                // Audífonos Gamer celestes/morados
                ctx.strokeStyle = "#38bdf8";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(x + 24, py + 14, 16, Math.PI, 0);
                ctx.stroke();
                ctx.fillStyle = "#38bdf8";
                ctx.fillRect(x + 5, py + 11, 6, 11);
                ctx.fillRect(x + 37, py + 11, 6, 11);
            }
            ctx.restore();
        }

        function drawFamilyCharacter(x, y, shirtColor, label) {
            const bounce = !candleLit ? Math.abs(Math.sin(time * 2.3 + x)) * 8 : 0;
            const py = y - bounce;
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(x + 12, py + 50, 9, 26);
            ctx.fillRect(x + 25, py + 50, 9, 26);
            ctx.fillStyle = shirtColor;
            ctx.beginPath();
            ctx.roundRect(x + 8, py + 26, 30, 28, 7);
            ctx.fill();
            ctx.fillStyle = "#fed7aa";
            ctx.beginPath();
            ctx.arc(x + 23, py + 14, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#271c19";
            ctx.beginPath();
            ctx.arc(x + 23, py + 10, 14, Math.PI, 0);
            ctx.fill();
        }
