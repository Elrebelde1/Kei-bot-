import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.trim()) {
    return m.reply("🔎 *Por favor ingresa el nombre de una canción o una URL de SoundCloud.*");
  }

  await m.react("🎶");

  try {
    // Buscar en SoundCloud
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/soundcloud?q=${encodeURIComponent(text.trim())}&limit=10`);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      return m.reply("❌ *No se encontraron resultados para tu búsqueda.*");
    }

    const track = data.data[0]; // Primer resultado
    const caption = `
╭─[*Sasuke SoundCloud*]─╮
│
│ 📌 *Título:* ${track.title}
│ 👤 *Autor:* ${track.artist}
│ ⏱️ *Duración:* ${Math.floor(track.duration / 1000)} segundos
│ ❤️ *Likes:* ${track.likes}
│ ▶️ *Reproducciones:* ${track.play}
│ 🔗 *Enlace:* ${track.link}
╰──────────────────╯

📥 *Procesando tu descarga...*
`;

    // Miniatura
    if (track.image) {
      const thumbnailRes = await fetch(track.image);
      const thumbnail = await thumbnailRes.buffer();
      await conn.sendFile(m.chat, thumbnail, "thumb.jpg", caption, m);
    } else {
      await m.reply(caption);
    }

    // Descargar audio
    const apiRes = await fetch(`https://delirius-apiofc.vercel.app/download/soundcloud?url=${encodeURIComponent(track.link)}`);
    const api = await apiRes.json();
    const dl = api?.data?.download; // ✅ CORREGIDO

    if (!dl) return m.reply("❌ *No se pudo obtener el audio.*");

    const fileRes = await fetch(dl);
    const contentLength = fileRes.headers.get("Content-Length");
    const bytes = parseInt(contentLength || 0, 10);
    const sizeMB = bytes / (1024 * 1024);
    const sendAsDoc = sizeMB >= limit;

    await conn.sendFile(m.chat, dl, `${track.title}.mp3`, "", m, null, {
      asDocument: sendAsDoc,
      mimetype: "audio/mpeg",
      ptt: false
    });

    await m.react("✅");

  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply("⚠️ *Ocurrió un error al procesar tu solicitud.*");
  }
};

handler.help = ["play"];
handler.tags = ["descargas", "soundcloud"];
handler.command = ["sound"];

export default handler;