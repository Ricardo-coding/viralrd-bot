const express = require("express");
const app = express();
app.use(express.json());

// =============================================
// NÚMERO DE PRUEBA — Solo este número ve el bot
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

// Submenús por opción
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
//   - "menu"      -> esperando opción del menú principal
//   - "1".."4"    -> esperando letra de submenú
//   - "asesor"    -> esperando que vuelva al menú
//   - "pausado"   -> el bot NO responde (lo maneja Ricardo a mano)
// =============================================
const sesiones = {};

// =============================================
// FUNCIÓN PARA ENVIAR MENSAJES VIA Z-API
// =============================================
async function enviarMensaje(telefono, mensaje) {
  const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE;
  const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: telefono, message: mensaje }),
  });
  return response.json();
}

// =============================================
// MENSAJE DE CONFIRMACIÓN DE PEDIDO
// =============================================
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
// EXTRAER TEXTO DEL MENSAJE
// Z-API puede mandar el texto en distintos campos
// según el tipo de mensaje. Si no hay texto, devuelve "".
// =============================================
function extraerTexto(body) {
  const raw =
    body?.text?.message ??
    body?.buttonsResponseMessage?.message ??
    body?.listResponseMessage?.message ??
    "";
  return raw.toString().trim().toLowerCase();
}

// =============================================
// WEBHOOK
// =============================================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (!body.phone || body.isGroup) return res.sendStatus(200);

    const telefono = body.phone;

    // ---------------------------------------------
    // MENSAJES TUYOS (fromMe) -> comandos de control
    // Le escribes "/pausar" o "/activar" al CHAT del
    // cliente desde tu propio WhatsApp para silenciar
    // o reactivar el bot en esa conversación.
    // ---------------------------------------------
    if (body.fromMe) {
      const cmd = extraerTexto(body);
      if (cmd === "/pausar") {
        sesiones[telefono] = "pausado";
        console.log(`⏸️ Bot pausado para ${telefono}`);
      } else if (cmd === "/activar") {
        sesiones[telefono] = "menu";
        console.log(`▶️ Bot reactivado para ${telefono}`);
      }
      return res.sendStatus(200);
    }

    // ---------------------------------------------
    // Ignorar cualquier webhook que NO sea un mensaje
    // de texto recibido (Z-API también manda eventos
    // de "enviado", "entregado", "leído", conexión, etc.
    // y esos no traen body.text -> msg sería "")
    // ---------------------------------------------
    const msg = extraerTexto(body);
    if (!msg) return res.sendStatus(200);

    // Modo prueba — solo responde a tu número
    if (NUMEROS_PRUEBA.length > 0 && !NUMEROS_PRUEBA.includes(telefono)) {
      return res.sendStatus(200);
    }

    console.log(`📩 ${telefono}: ${msg}`);

    const estado = sesiones[telefono] || "menu";

    // Si está pausado (lo está atendiendo Ricardo), no responder
    if (estado === "pausado") {
      return res.sendStatus(200);
    }

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
      // Estado asesor u otros — cualquier mensaje vuelve al menú
      sesiones[telefono] = "menu";
      respuesta = MENU_PRINCIPAL;
    }

    await enviarMensaje(telefono, respuesta);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => res.json({ status: "ViralRD Bot activo ✅" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ViralRD Bot corriendo en puerto ${PORT}`));
