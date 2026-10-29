/* Datos de los escenarios: plataformas y personajes */
const scenes = [
            {
                title: "🏗️ Escenario 1: Obra Civil",
                platforms: [
                    { x: 280, y: 490, w: 160, h: 18, type: "beam" },
                    { x: 490, y: 400, w: 160, h: 18, type: "beam" },
                    { x: 860, y: 480, w: 180, h: 18, type: "beam" }
                ],
                npc: {
                    x: 680, y: groundY - 78, w: 50, h: 78,
                    type: "chalan",
                    name: "Maestro de Obra (Chalán)",
                    msg: "¡Ya está todo listo en la obra, Ingeniera! Los planos quedaron perfectos. ¡Pásela increíble en sus 20, aquí todos admiramos su esfuerzo! (Sigue a la derecha ➡️)"
                }
            },
            {
                title: "🌸 Escenario 2: Parque Infinito",
                platforms: [
                    { x: 260, y: 500, w: 140, h: 20, type: "wood" },
                    { x: 460, y: 410, w: 150, h: 20, type: "wood" },
                    { x: 830, y: 480, w: 150, h: 20, type: "wood" }
                ],
                npc: {
                    x: 650, y: groundY - 85, w: 50, h: 85,
                    type: "gojo",
                    name: "Satoru Gojo",
                    msg: "Tranquila, los nuevos 20 no son nada malos. Tienes a tu familia y amigos apoyándote siempre... y conmigo de tu lado, tu potencial como ingeniera es Infinito 🤞🩵"
                }
            },
            {
                title: "⛏️ Escenario 3: Mundo Duxo",
                platforms: [
                    { x: 270, y: 480, w: 170, h: 18, type: "block" },
                    { x: 500, y: 380, w: 160, h: 18, type: "block" },
                    { x: 850, y: 470, w: 160, h: 18, type: "block" }
                ],
                npc: {
                    x: 690, y: groundY - 78, w: 50, h: 78,
                    type: "duxo",
                    name: "Duxorethey",
                    msg: "¡Buenaaas! Bienvenida al nivel 20. No tengas miedo de esta nueva etapa, toda tu gente te banca a muerte y sabemos que la vas a romper toda. ¡Ve al mirador que te esperan! ➡️"
                }
            },
            {
                title: "🌅 Escenario Final: El Gran Mirador",
                platforms: [
                    { x: 220, y: 500, w: 140, h: 18, type: "wood" },
                    { x: 920, y: 500, w: 140, h: 18, type: "wood" }
                ],
                npc: null
            }
        ];
