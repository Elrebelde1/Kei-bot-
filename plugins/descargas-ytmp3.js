
import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command}) => {
  const apikey = "sylphy-8238wss";

  if (!text || (!text.includes("youtube.com") &&!text.includes("youtu.be"))) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <enlace de YouTube>\n📍 *Ejemplo:* ${usedPrefix + command} https://youtu.be/z6LsIMZ546w`);
}

  await m.react("⏳"); // Reacción inicial

  try {
    const url = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(text)}&apikey=sylphy-8238wss`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const data = json?.res;

    if (!json.status ||!data?.url) {
      return m.reply("❌ No se pudo obtener el audio. Verifica el enlace o intenta con otro video.");
}

    const { title, url: dl_url, format} = data;

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: dl_url},
        mimetype: 'audio/mpeg',
        fileName: `${title}.${format}`
},
      { quoted: m}
);

    await m.react("🟢"); // Reacción final al completar
} catch (error) {
    console.error("❌ Error:", error);
    await conn.reply(m.chat, `🚨 *Error:* ${error.message || "No se pudo procesar la solicitud."}`, m);
}
};

handler.help = ["ytmp3 <enlace>"];
handler.tags = ["descargas"];
handler.command = ["ytmp3"];

export default handler;