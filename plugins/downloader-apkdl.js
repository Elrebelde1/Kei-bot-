
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

    if (!json.objects ||!json.objects.length ||!json.objects[0].content) {
      throw new Error("No se encontraron resultados válidos.");
}

    let raw;
    try {
      raw = JSON.parse(json.objects[0].content);
} catch (e) {
      throw new Error("No se pudo analizar la información de la app.");
}

    const {
      name = "Desconocido",
      size = "N/A",
      package: pkg = "N/A",
      lastUpdate = "N/A",
      icon,
      dllink = null
} = raw;

    const caption = `
📱 *Nombre:* ${name}
📦 *Paquete:* ${pkg}
🗓️ *Última actualización:* ${lastUpdate}
📁 *Tamaño:* ${size}
🔗 *Descarga:* ${dllink || "No disponible"}
`;

    if (icon) {
      const iconRes = await fetch(icon);
      const iconBuffer = await iconRes.buffer();
      await conn.sendFile(m.chat, iconBuffer, "icon.png", caption, m);
} else {
      await m.reply(caption);
}

    // Intentar enviar el APK si el enlace es directo
    if (dllink && dllink.endsWith(".apk")) {
      await conn.sendFile(m.chat, dllink, `${name}.apk`, `📦 *Aquí tienes el APK de ${name}*`, m);
}

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