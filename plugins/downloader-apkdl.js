
import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return m.reply(`📦 *Uso correcto:*\n${usedPrefix + command} <nombre de la app>\n📍 *Ejemplo:* ${usedPrefix + command} WhatsApp`);
}

  await m.react("⏳");

  try {
    const apiUrl = `https://api.dorratz.com/v2/apk-dl?text=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    const raw = JSON.parse(json.objects[0].content);
    const {
      name,
      size,
      package,
      lastUpdate,
      icon,
      dllink
} = raw;

    const caption = `
📱 *Nombre:* ${name}
📦 *Paquete:* ${package}
🗓️ *Última actualización:* ${lastUpdate}
📁 *Tamaño:* ${size}
🔗 *Descarga:* ${dllink}
`;

    const iconRes = await fetch(icon);
    const iconBuffer = await iconRes.buffer();

    await conn.sendFile(m.chat, iconBuffer, "icon.png", caption, m);
    await m.react("✅");
} catch (error) {
    console.error("❌ Error:", error);
    await m.reply("⚠️ *No se pudo obtener la información del APK. Intenta con otro nombre o más específico.*");
}
};

handler.help = ["apk <nombre de la app>"];
handler.tags = ["descargas"];
handler.command = ["apk"];

export default handler;