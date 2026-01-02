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

    // Mostrar miniatura + caption
    if (track.image) {
      await conn.sendMessage(m.chat, { 
        image: { url: track.image }, 
        caption 
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    // Descargar audio
    const apiRes = await fetch(`https://delirius-apiofc.vercel.app/download/soundcloud?url=${encodeURIComponent(track.link)}`);
    const api = await apiRes.json();
    const dl = api?.data?.download; // ✅ CORREGIDO

    if (!dl) return m.reply("❌ *No se pudo obtener el audio.*");

    // Enviar como audio reproducible en Android/iPhone
    await conn.sendMessage(m.chat, {
      audio: { url: dl },
      mimetype: "audio/mpeg",
      fileName: `${track.title}.mp3`,
      caption: `🎶 ${track.title} - ${track.artist}`
    }, { quoted: m });

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