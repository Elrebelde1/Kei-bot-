
import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text || (!text.includes("youtube.com") &&!text.includes("youtu.be"))) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <enlace de YouTube>\n📍 *Ejemplo:* ${usedPrefix + command} https://youtu.be/z6LsIMZ546w`);
}

  await m.react("⏳"); // Reacción inicial

  try {
    const url = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(text)}&quality=128`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const data = json?.result;

    if (!data?.status ||!data?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio. Verifica el enlace o intenta con otro video.");
}

    const { title, download, metadata} = data;
    const dl_url = download.url;
    const filename = download.filename || `${title}.mp3`;

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: dl_url},
        mimetype: 'audio/mpeg',
        fileName: filename
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