import yts from "yt-search";
import fetch from "node-fetch";

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🎧 *Ingresa el nombre de un video o una URL de YouTube.*");

  await m.react("🔎");

  try {
    const search = await yts(text);
    const video = search?.videos?.[0];

    if (!video) return m.reply("❌ *No se encontraron resultados.*");

    // Usando la API de Vreden proporcionada en tu consulta
    const apiUrl = `https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(video.url)}`;
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (!json.status || !json.result.download.url) {
      return m.reply("⚠️ *Error al convertir el audio con la API de Vreden.*");
    }

    const caption = `
╭─🎶 *Sasuke Bot - Audio* 🎶─╮
│
│ 🎵 *Título:* ${json.result.metadata.title}
│ 👤 *Canal:* ${json.result.metadata.author.name}
│ ⏱️ *Duración:* ${json.result.metadata.timestamp}
│ 📥 *Enviando archivo...*
╰──────────────────────────╯`;

    // Enviar miniatura y mensaje de descarga
    await conn.sendFile(m.chat, json.result.metadata.thumbnail, "thumb.jpg", caption, m);

    // Enviar el archivo de audio directamente
    await conn.sendMessage(m.chat, {
      audio: { url: json.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${json.result.metadata.title}.mp3`
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    return m.reply("💥 *Hubo un fallo en la solicitud.*");
  }
};

handler.command = ["play2", "vreden"]; // Nombres de comando ejemplo
export default handler;
