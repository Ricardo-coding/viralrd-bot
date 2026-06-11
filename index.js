const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const pino = require("pino");
const http = require("http");
const fs = require("fs");

// =============================================
// NÚMERO DE PRUEBA — Solo este número ve el bot
// Formato: solo dígitos, sin "+" (ej: 18298203465)
// Cambia a [] para activar para todos
// =============================================
const NUMEROS_PRUEBA = ["18298203465"];

// =============================================
// MENSAJES DEL BOT VIRALRD
// =============================================

const MENU_PRINCIPAL = `¡Hola! 👋 Bienvenido a *ViralRD* 🚀
El servicio #1 de crecimiento en redes sociales en República Dominicana.

Elige una opción enviando el número:

1️⃣ - Seguidores Instagram
2️⃣ - Likes Instagram
3️⃣ - Combos Instagram (seguidores + likes)
4️⃣ - Seguidores Facebook
5️⃣ - 🎁 Prueba (RD$50)
6️⃣ - 💳 Cómo pagar
7️⃣ - 👨‍💼 Hablar con un asesor`;

const PAGO_INFO = `🏦 BHD — Ahorro 37936020016
🏦 Banreservas — Ahorro 9608291810
🏦 Popular — Ahorro 848898938
📱 QIK — 1007351344
👤 A nombre de: *Ricardo Cedano*`;

const SUBMENUS = {
  "1": {
    texto: `📈 *Seguidores Instagram*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y F.\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 seguidores Instagram", precio: "RD$350", usuario: "Instagram" },
      b: { nombre: "2,500 seguidores Instagram", precio: "RD$750", usuario: "Instagram" },
      c: { nombre: "5,000 seguidores Instagram", precio: "RD$1,300", usuario: "Instagram" },
      d: { nombre: "10,000 seguidores Instagram", precio: "RD$2,300", usuario: "Instagram" },
      e: { nombre: "25,000 seguidores Instagram", precio: "RD$4,200", usuario: "Instagram" },
      f: { nombre: "50,000 seguidores Instagram", precio: "RD$6,500", usuario: "Instagram" },
    },
  },
  "2": {
    texto: `❤️ *Likes Instagram*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 likes — RD$250\nB → 2,500 likes — RD$500\nC → 5,000 likes — RD$850\nD → 10,000 likes — RD$1,400\nE → 25,000 likes — RD$2,700\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y E.\n\nA → 1,000 likes — RD$250\nB → 2,500 likes — RD$500\nC → 5,000 likes — RD$850\nD → 10,000 likes — RD$1,400\nE → 25,000 likes — RD$2,700\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 likes Instagram", precio: "RD$250", usuario: "Instagram" },
      b: { nombre: "2,500 likes Instagram", precio: "RD$500", usuario: "Instagram" },
      c: { nombre: "5,000 likes Instagram", precio: "RD$850", usuario: "Instagram" },
      d: { nombre: "10,000 likes Instagram", precio: "RD$1,400", usuario: "Instagram" },
      e: { nombre: "25,000 likes Instagram", precio: "RD$2,700", usuario: "Instagram" },
    },
  },
  "3": {
    texto: `🔥 *Combos Instagram — Seguidores + Likes*\n\nAhorra más combinando ambos servicios:\n\nA → Combo Starter — 1,000 seg + 1,000 likes — RD$550 *(ahorras RD$50)*\nB → Combo Growth — 2,500 seg + 2,500 likes — RD$1,150 *(ahorras RD$100)*\nC → Combo Pro — 5,000 seg + 5,000 likes — RD$2,000 *(ahorras RD$150)*\nD → Combo Elite — 10,000 seg + 10,000 likes — RD$3,550 *(ahorras RD$150)*\nE → Combo Boss — 25,000 seg + 25,000 likes — RD$6,700 *(ahorras RD$200)*\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y E.\n\nA → Combo Starter — RD$550\nB → Combo Growth — RD$1,150\nC → Combo Pro — RD$2,000\nD → Combo Elite — RD$3,550\nE → Combo Boss — RD$6,700\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "Combo Starter\n📦 1,000 seguidores + 1,000 likes Instagram", precio: "RD$550", usuario: "Instagram" },
      b: { nombre: "Combo Growth\n📦 2,500 seguidores + 2,500 likes Instagram", precio: "RD$1,150", usuario: "Instagram" },
      c: { nombre: "Combo Pro\n📦 5,000 seguidores + 5,000 likes Instagram", precio: "RD$2,000", usuario: "Instagram" },
      d: { nombre: "Combo Elite\n📦 10,000 seguidores + 10,000 likes Instagram", precio: "RD$3,550", usuario: "Instagram" },
      e: { nombre: "Combo Boss\n📦 25,000 seguidores + 25,000 likes Instagram", precio: "RD$6,700", usuario: "Instagram" },
    },
  },
  "4": {
    texto: `👥 *Seguidores Facebook*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y F.\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 seguidores Facebook", precio: "RD$350", usuario: "Facebook" },
      b: { nombre: "2,500 seguidores Facebook", precio: "RD$750", usuario: "Facebook" },
      c: { nombre: "5,000 seguidores Facebook", precio: "RD$1,300", usuario: "Facebook" },
      d: { nombre: "10,000 seguidores Facebook", precio: "RD$2,300", usuario: "Facebook" },
      e: { nombre: "25,000 seguidores Facebook", precio: "RD$4,200", usuario: "Facebook" },
      f: { nombre: "50,000 seguidores Facebook", precio: "RD$6,500", usuario: "Facebook" },
    },
  },
};

const MSG_PRUEBA = `🎁 *Prueba ViralRD — Solo RD$50*

Recibe 100 seguidores en tu Instagram por solo RD$50.
¡Comprueba la calidad antes de invertir más! ✅

Realiza tu pago de *RD$50* a:

${PAGO_INFO}

Luego envíanos:
1. 📸 Captura del comprobante
2. 👤 Tu usuario de Instagram

⚡ En minutos tienes tus seguidores. 🚀`;

const MSG_PAGO = `💳 *Métodos de pago*

🏦 *Transferencia bancaria:*
${PAGO_INFO}

💳 *Tarjeta de crédito/débito:*
Escribe *"tarjeta"* y un asesor te contactará.

↩️ Escribe *0* para volver al menú.`;

const MSG_ASESOR = `👨‍💼 Un asesor te atenderá en breve.

Horario: Lunes a Sábado 9am – 9pm 🕘

↩️ Escribe *0* para volver al menú.`;

const MSG_ERROR_MENU = `❌ No entendimos tu mensaje.

Por favor elige una opción del menú:

1️⃣ - Seguidores Instagram
2️⃣ - Likes Instagram
3️⃣ - Combos Instagram
4️⃣ - Seguidores Facebook
5️⃣ - 🎁 Prueba (RD$50)
6️⃣ - 💳 Cómo pagar
7️⃣ - 👨‍💼 Hablar con un asesor`;

// =============================================
// ESTADO DE SESIONES
// =============================================
const sesiones = {};

// =============================================
// SERVIDOR HTTP
// =============================================
let ultimoQR = null;
let estadoConexion = "Esperando QR...";

http
  .createServer(async (req, res) => {
    // --- /qr → muestra el QR para escanear ---
    if (req.url === "/qr") {
      if (ultimoQR) {
        const qrImagen = await QRCode.toDataURL(ultimoQR);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2>Escanea con WhatsApp → Dispositivos vinculados</h2>
              <img src="${qrImagen}" style="width:300px;height:300px;" />
              <p>Esta página se actualiza sola cada 10 segundos</p>
              <script>setTimeout(() => location.reload(), 10000)</script>
            </body>
          </html>
        `);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2>${estadoConexion}</h2>
              <script>setTimeout(() => location.reload(), 5000)</script>
            </body>
          </html>
        `);
      }

    // --- /reset → borra la sesión guardada ---
    } else if (req.url === "/reset") {
      try {
        fs.rmSync("auth_info", { recursive: true, force: true });
        ultimoQR = null;
        estadoConexion = "Sesión borrada. Reinicia el bot.";
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2>✅ Sesión borrada correctamente.</h2>
              <p>Ahora ve a Railway y haz <strong>Redeploy</strong> para que el bot arranque limpio y genere el QR.</p>
            </body>
          </html>
        `);
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error al borrar: " + e.message);
      }

    // --- raíz → estado general ---
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: estadoConexion }));
    }
  })
  .listen(process.env.PORT || 3000, () => {
    console.log(`🌐 Servidor HTTP corriendo en puerto ${process.env.PORT || 3000}`);
  });


function mensajePedido(opcion) {
  return `✅ *Pedido: ${opcion.nombre}*
💰 *Total: ${opcion.precio}*

Realiza tu pago a cualquiera de estas cuentas:

${PAGO_INFO}

Luego envíanos:
1. 📸 Captura del comprobante
2. 👤 Tu usuario de ${opcion.usuario}

⚡ Procesamos tu pedido de inmediato.`;
}

// =============================================
// LÓGICA DEL BOT
// =============================================
function procesarMensaje(telefono, msgRaw) {
  const msg = msgRaw.trim().toLowerCase();

  if (msg === "/pausar") {
    sesiones[telefono] = "pausado";
    console.log(`⏸️ Bot pausado para ${telefono}`);
    return null;
  }
  if (msg === "/activar") {
    sesiones[telefono] = "menu";
    console.log(`▶️ Bot reactivado para ${telefono}`);
    return null;
  }

  const estado = sesiones[telefono] || "menu";
  if (estado === "pausado") return null;

  let respuesta = "";

  if (msg === "0") {
    sesiones[telefono] = "menu";
    respuesta = MENU_PRINCIPAL;
  } else if (estado === "menu") {
    if (["1", "2", "3", "4"].includes(msg)) {
      sesiones[telefono] = msg;
      respuesta = SUBMENUS[msg].texto;
    } else if (msg === "5") {
      sesiones[telefono] = "menu";
      respuesta = MSG_PRUEBA;
    } else if (msg === "6") {
      sesiones[telefono] = "menu";
      respuesta = MSG_PAGO;
    } else if (msg === "7") {
      sesiones[telefono] = "asesor";
      respuesta = MSG_ASESOR;
    } else {
      respuesta = MSG_ERROR_MENU;
    }
  } else if (["1", "2", "3", "4"].includes(estado)) {
    const submenu = SUBMENUS[estado];
    if (submenu.opciones[msg]) {
      sesiones[telefono] = "menu";
      respuesta = mensajePedido(submenu.opciones[msg]);
    } else {
      respuesta = submenu.error;
    }
  } else {
    sesiones[telefono] = "menu";
    respuesta = MENU_PRINCIPAL;
  }

  return respuesta;
}

// =============================================
// CONEXIÓN CON WHATSAPP (BAILEYS)
// =============================================
async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      ultimoQR = qr;
      estadoConexion = "QR generado, ve a /qr para escanear";
      console.log("📱 Nuevo QR generado a las", new Date().toLocaleTimeString(), "— entra a /qr para escanearlo");
    }

    if (connection === "close") {
      const motivo = lastDisconnect?.error?.output?.statusCode;
      const debeReconectar = motivo !== DisconnectReason.loggedOut;
      estadoConexion = "Conexión cerrada, reconectando en 15 segundos...";
      console.log("Conexión cerrada. Motivo:", motivo, "— Reconectando:", debeReconectar);
      if (debeReconectar) {
        setTimeout(() => iniciarBot(), 15000);
      }
    } else if (connection === "open") {
      ultimoQR = null;
      estadoConexion = "✅ Conectado a WhatsApp";
      console.log("✅ Bot ViralRD conectado a WhatsApp");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m.message) return;

      const jid = m.key.remoteJid;
      if (jid.endsWith("@g.us")) return;
      if (jid === "status@broadcast") return;

      const telefono = jid.split("@")[0];
      const fromMe = m.key.fromMe;

      const texto =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        "";

      if (!texto) return;

      if (fromMe) {
        procesarMensaje(telefono, texto);
        return;
      }

      if (NUMEROS_PRUEBA.length > 0 && !NUMEROS_PRUEBA.includes(telefono)) {
        return;
      }

      console.log(`📩 ${telefono}: ${texto}`);

      const respuesta = procesarMensaje(telefono, texto);
      if (respuesta) {
        await sock.sendMessage(jid, { text: respuesta });
      }
    } catch (err) {
      console.error("Error procesando mensaje:", err);
    }
  });
}

iniciarBot();🏦 Popular — Ahorro 848898938
📱 QIK — 1007351344
👤 A nombre de: *Ricardo Cedano*`;

const SUBMENUS = {
  "1": {
    texto: `📈 *Seguidores Instagram*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y F.\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 seguidores Instagram", precio: "RD$350", usuario: "Instagram" },
      b: { nombre: "2,500 seguidores Instagram", precio: "RD$750", usuario: "Instagram" },
      c: { nombre: "5,000 seguidores Instagram", precio: "RD$1,300", usuario: "Instagram" },
      d: { nombre: "10,000 seguidores Instagram", precio: "RD$2,300", usuario: "Instagram" },
      e: { nombre: "25,000 seguidores Instagram", precio: "RD$4,200", usuario: "Instagram" },
      f: { nombre: "50,000 seguidores Instagram", precio: "RD$6,500", usuario: "Instagram" },
    },
  },
  "2": {
    texto: `❤️ *Likes Instagram*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 likes — RD$250\nB → 2,500 likes — RD$500\nC → 5,000 likes — RD$850\nD → 10,000 likes — RD$1,400\nE → 25,000 likes — RD$2,700\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y E.\n\nA → 1,000 likes — RD$250\nB → 2,500 likes — RD$500\nC → 5,000 likes — RD$850\nD → 10,000 likes — RD$1,400\nE → 25,000 likes — RD$2,700\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 likes Instagram", precio: "RD$250", usuario: "Instagram" },
      b: { nombre: "2,500 likes Instagram", precio: "RD$500", usuario: "Instagram" },
      c: { nombre: "5,000 likes Instagram", precio: "RD$850", usuario: "Instagram" },
      d: { nombre: "10,000 likes Instagram", precio: "RD$1,400", usuario: "Instagram" },
      e: { nombre: "25,000 likes Instagram", precio: "RD$2,700", usuario: "Instagram" },
    },
  },
  "3": {
    texto: `🔥 *Combos Instagram — Seguidores + Likes*\n\nAhorra más combinando ambos servicios:\n\nA → Combo Starter — 1,000 seg + 1,000 likes — RD$550 *(ahorras RD$50)*\nB → Combo Growth — 2,500 seg + 2,500 likes — RD$1,150 *(ahorras RD$100)*\nC → Combo Pro — 5,000 seg + 5,000 likes — RD$2,000 *(ahorras RD$150)*\nD → Combo Elite — 10,000 seg + 10,000 likes — RD$3,550 *(ahorras RD$150)*\nE → Combo Boss — 25,000 seg + 25,000 likes — RD$6,700 *(ahorras RD$200)*\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y E.\n\nA → Combo Starter — RD$550\nB → Combo Growth — RD$1,150\nC → Combo Pro — RD$2,000\nD → Combo Elite — RD$3,550\nE → Combo Boss — RD$6,700\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "Combo Starter\n📦 1,000 seguidores + 1,000 likes Instagram", precio: "RD$550", usuario: "Instagram" },
      b: { nombre: "Combo Growth\n📦 2,500 seguidores + 2,500 likes Instagram", precio: "RD$1,150", usuario: "Instagram" },
      c: { nombre: "Combo Pro\n📦 5,000 seguidores + 5,000 likes Instagram", precio: "RD$2,000", usuario: "Instagram" },
      d: { nombre: "Combo Elite\n📦 10,000 seguidores + 10,000 likes Instagram", precio: "RD$3,550", usuario: "Instagram" },
      e: { nombre: "Combo Boss\n📦 25,000 seguidores + 25,000 likes Instagram", precio: "RD$6,700", usuario: "Instagram" },
    },
  },
  "4": {
    texto: `👥 *Seguidores Facebook*\n\nElige tu paquete escribiendo la letra:\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ Escribe *0* para volver al menú.`,
    error: `❌ Opción no válida.\n\nPor favor elige una letra entre A y F.\n\nA → 1,000 seguidores — RD$350\nB → 2,500 seguidores — RD$750\nC → 5,000 seguidores — RD$1,300\nD → 10,000 seguidores — RD$2,300\nE → 25,000 seguidores — RD$4,200\nF → 50,000 seguidores — RD$6,500\n\n↩️ O escribe *0* para volver al menú.`,
    opciones: {
      a: { nombre: "1,000 seguidores Facebook", precio: "RD$350", usuario: "Facebook" },
      b: { nombre: "2,500 seguidores Facebook", precio: "RD$750", usuario: "Facebook" },
      c: { nombre: "5,000 seguidores Facebook", precio: "RD$1,300", usuario: "Facebook" },
      d: { nombre: "10,000 seguidores Facebook", precio: "RD$2,300", usuario: "Facebook" },
      e: { nombre: "25,000 seguidores Facebook", precio: "RD$4,200", usuario: "Facebook" },
      f: { nombre: "50,000 seguidores Facebook", precio: "RD$6,500", usuario: "Facebook" },
    },
  },
};

const MSG_PRUEBA = `🎁 *Prueba ViralRD — Solo RD$50*

Recibe 100 seguidores en tu Instagram por solo RD$50.
¡Comprueba la calidad antes de invertir más! ✅

Realiza tu pago de *RD$50* a:

${PAGO_INFO}

Luego envíanos:
1. 📸 Captura del comprobante
2. 👤 Tu usuario de Instagram

⚡ En minutos tienes tus seguidores. 🚀`;

const MSG_PAGO = `💳 *Métodos de pago*

🏦 *Transferencia bancaria:*
${PAGO_INFO}

💳 *Tarjeta de crédito/débito:*
Escribe *"tarjeta"* y un asesor te contactará.

↩️ Escribe *0* para volver al menú.`;

const MSG_ASESOR = `👨‍💼 Un asesor te atenderá en breve.

Horario: Lunes a Sábado 9am – 9pm 🕘

↩️ Escribe *0* para volver al menú.`;

const MSG_ERROR_MENU = `❌ No entendimos tu mensaje.

Por favor elige una opción del menú:

1️⃣ - Seguidores Instagram
2️⃣ - Likes Instagram
3️⃣ - Combos Instagram
4️⃣ - Seguidores Facebook
5️⃣ - 🎁 Prueba (RD$50)
6️⃣ - 💳 Cómo pagar
7️⃣ - 👨‍💼 Hablar con un asesor`;

// =============================================
// ESTADO DE SESIONES
//   "menu"    -> esperando opción del menú principal
//   "1".."4"  -> esperando letra de submenú
//   "asesor"  -> esperando que vuelva al menú
//   "pausado" -> el bot NO responde (lo maneja Ricardo a mano)
// =============================================
const sesiones = {};

// =============================================
// SERVIDOR HTTP — para ver el QR en el navegador
// =============================================
let ultimoQR = null;
let estadoConexion = "Esperando QR...";

http
  .createServer(async (req, res) => {
    if (req.url === "/qr") {
      if (ultimoQR) {
        const qrImagen = await QRCode.toDataURL(ultimoQR);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2>Escanea con WhatsApp → Dispositivos vinculados</h2>
              <img src="${qrImagen}" style="width:300px;height:300px;" />
              <p>Esta página se actualiza sola cada 10 segundos</p>
              <script>setTimeout(() => location.reload(), 10000)</script>
            </body>
          </html>
        `);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2>${estadoConexion}</h2>
              <script>setTimeout(() => location.reload(), 5000)</script>
            </body>
          </html>
        `);
      }
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: estadoConexion }));
    }
  })
  .listen(process.env.PORT || 3000, () => {
    console.log(`🌐 Servidor HTTP corriendo en puerto ${process.env.PORT || 3000}`);
  });


function mensajePedido(opcion) {
  return `✅ *Pedido: ${opcion.nombre}*
💰 *Total: ${opcion.precio}*

Realiza tu pago a cualquiera de estas cuentas:

${PAGO_INFO}

Luego envíanos:
1. 📸 Captura del comprobante
2. 👤 Tu usuario de ${opcion.usuario}

⚡ Procesamos tu pedido de inmediato.`;
}

// =============================================
// LÓGICA DEL BOT (idéntica a la versión Z-API)
// Recibe el teléfono y el texto, devuelve la respuesta
// o null si no debe responder nada.
// =============================================
function procesarMensaje(telefono, msgRaw) {
  const msg = msgRaw.trim().toLowerCase();

  // Comandos de control (los envías TÚ desde tu propio número)
  if (msg === "/pausar") {
    sesiones[telefono] = "pausado";
    console.log(`⏸️ Bot pausado para ${telefono}`);
    return null;
  }
  if (msg === "/activar") {
    sesiones[telefono] = "menu";
    console.log(`▶️ Bot reactivado para ${telefono}`);
    return null;
  }

  const estado = sesiones[telefono] || "menu";

  if (estado === "pausado") return null;

  let respuesta = "";

  if (msg === "0") {
    sesiones[telefono] = "menu";
    respuesta = MENU_PRINCIPAL;
  } else if (estado === "menu") {
    if (["1", "2", "3", "4"].includes(msg)) {
      sesiones[telefono] = msg;
      respuesta = SUBMENUS[msg].texto;
    } else if (msg === "5") {
      sesiones[telefono] = "menu";
      respuesta = MSG_PRUEBA;
    } else if (msg === "6") {
      sesiones[telefono] = "menu";
      respuesta = MSG_PAGO;
    } else if (msg === "7") {
      sesiones[telefono] = "asesor";
      respuesta = MSG_ASESOR;
    } else {
      respuesta = MSG_ERROR_MENU;
    }
  } else if (["1", "2", "3", "4"].includes(estado)) {
    const submenu = SUBMENUS[estado];
    if (submenu.opciones[msg]) {
      sesiones[telefono] = "menu";
      respuesta = mensajePedido(submenu.opciones[msg]);
    } else {
      respuesta = submenu.error;
    }
  } else {
    sesiones[telefono] = "menu";
    respuesta = MENU_PRINCIPAL;
  }

  return respuesta;
}

// =============================================
// CONEXIÓN CON WHATSAPP (BAILEYS)
// =============================================
async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      ultimoQR = qr;
      estadoConexion = "QR generado, ve a /qr para escanear";
      console.log("📱 Nuevo QR generado a las", new Date().toLocaleTimeString(), "— entra a /qr para escanearlo");
    }

    if (connection === "close") {
      const motivo = lastDisconnect?.error?.output?.statusCode;
      const debeReconectar = motivo !== DisconnectReason.loggedOut;
      estadoConexion = "Conexión cerrada, reconectando en 15 segundos...";
      console.log("Conexión cerrada. Motivo:", motivo, "— Reconectando:", debeReconectar);
      if (debeReconectar) {
        setTimeout(() => iniciarBot(), 15000);
      }
    } else if (connection === "open") {
      ultimoQR = null;
      estadoConexion = "✅ Conectado a WhatsApp";
      console.log("✅ Bot ViralRD conectado a WhatsApp");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m.message) return;

      const jid = m.key.remoteJid;
      if (jid.endsWith("@g.us")) return; // ignorar grupos
      if (jid === "status@broadcast") return;

      const telefono = jid.split("@")[0];
      const fromMe = m.key.fromMe;

      const texto =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        "";

      if (!texto) return;

      // Si el mensaje es tuyo, solo procesamos comandos /pausar /activar
      if (fromMe) {
        procesarMensaje(telefono, texto);
        return;
      }

      // Modo prueba
      if (NUMEROS_PRUEBA.length > 0 && !NUMEROS_PRUEBA.includes(telefono)) {
        return;
      }

      console.log(`📩 ${telefono}: ${texto}`);

      const respuesta = procesarMensaje(telefono, texto);
      if (respuesta) {
        await sock.sendMessage(jid, { text: respuesta });
      }
    } catch (err) {
      console.error("Error procesando mensaje:", err);
    }
  });
}

iniciarBot();
