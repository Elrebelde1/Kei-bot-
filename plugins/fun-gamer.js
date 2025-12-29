
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const handler = async (msg, { conn, text}) => {
  const chatID = msg.key.remoteJid;
  await conn.sendPresenceUpdate("composing", chatID);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await conn.sendPresenceUpdate("paused", chatID);

  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
}
  const usedPrefix = prefixes[subbotID] || ".";

  if (!text) {
    return conn.sendMessage(chatID, {
      text:
        `📌 *Uso correcto:*\n\n${usedPrefix}wa <número>\n\n` +
        `📍 *Ejemplo:* ${usedPrefix}wa 584125877491`,
}, { quoted: msg});
}

  const cleanNumber = text.replace(/[^0-9]/g, "");
  if (cleanNumber.length < 8) {
    return conn.sendMessage(chatID, {
      text: "❌ *Número inválido.* Debe tener al menos 8 dígitos.",
}, { quoted: msg});
}

  await conn.sendMessage(chatID, {
    react: { text: "🔍", key: msg.key},
});

  try {
    const url = `https://io.tylarz.top/v1/bancheck?number=${cleanNumber}&lang=es`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": "nami",
},
      timeout: 15000,
});

    const data = await res.json();
    if (!data.status) throw new Error("La API no respondió correctamente");

    const banInfo = data.data;
    const estado = banInfo.isBanned? "🚫 *BANEADO*": "✅ *ACTIVO*";

    const mensaje = `╭───⭑ *WHATSAPP STATUS* ⭑───╮\n│\n│  📞 *Número:* ${cleanNumber}\n│  📡 *Estado:* ${estado}\n│\n╰────────────────────╯\n\n> Powered by: *WHT*`;

    await conn.sendMessage(chatID, { text: mensaje}, { quoted: msg});
    await conn.sendMessage(chatID, {
      react: { text: "✅", key: msg.key},
});
} catch (error) {
    console.error("Error en.wa:", error);

    let errMsg = "❌ *Error verificando el número.*\n\n";

    if (error.code === "ECONNABORTED") {
      errMsg += "⏰ _Timeout - El servidor no respondió_";
} else if (error.status === 403) {
      errMsg += "🔒 _Acceso denegado por el servidor_";
} else if (error.status === 404) {
      errMsg += "🔍 _Número no encontrado_";
} else {
      errMsg += "⚠️ _Error interno del servicio_";
}

    errMsg += "\n\n> Powered by: *Barboza*";

    await conn.sendMessage(chatID, { text: errMsg}, { quoted: msg});
    await conn.sendMessage(chatID, {
      react: { text: "❌", key: msg.key},
});
}
};

handler.command = ["wa"];
export default handler;