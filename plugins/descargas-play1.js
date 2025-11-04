Import yts from "yt-search";
import fetch from "node-fetch";

const limit = 100; // MB

const handler = async (m, { conn, text, command}) => {
  if (!text ||!text.trim()) {
    return m.reply(`🎶 *¿Qué villancico quieres escuchar?* 🎁
*Uso correcto:*
.play <nombre o URL de YouTube>
📍 Ejemplo:.play All I Want for Christmas Is You
📍 Ejemplo:.play https://youtu.be/yQC7Jfxz9cY`);
}

  // Reacción inicial festiva
  await m.react("🎄");

  try {
    const isUrl = text.includes("youtube.com") || text.includes("youtu.be");
    const videoUrl = isUrl? text.trim(): null;

    let video;
    if (!videoUrl) {
      const res = await yts(text.trim());
      if (!res ||!res.all || res.all.length === 0) {
        return m.reply("❌ *El trineo no encontró resultados para tu búsqueda.*");
}
      video = res.all[0];
}

    const urlToUse = videoUrl || video.url;
    const title = video?.title || "Descarga de YouTube";
    const author = video?.author?.name || "Desconocido";
    const duration = video?.duration?.timestamp || "No disponible";
    const views = video?.views? video.views.toLocaleString(): "N/A";
    const thumbnail = video?.thumbnail || "https://i.imgur.com/JP52fdP.jpg";

    // Encabezado y etiquetas navideñas
    // FIX: Se envuelve el diseño en triple backticks (```) para forzar la alineación.
    const caption = `
\`\`\`
╭─[ Trineo Musical de Sasuke ]─╮
│ 🎶 Villancico: ${title}
│ 👤 Intérprete: ${author}
│ ⏱️ Tiempo en el Polo: ${duration}
│ 👁️ Nieve Vistas: ${views}
│ 🔗 Pista Musical: ${urlToUse}
╰──────────────────╯
\`\`\`

🎁 *Santa está empacando tu regalo...*
`;

    const thumbRes = await fetch(thumbnail);
    const thumbBuffer = await await thumbRes.buffer();
    await conn.sendFile(m.chat, thumbBuffer, "thumb.jpg", caption, m);

    if (command === "play") {
      const apiRes = await fetch(`https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(urlToUse)}&quality=128`);
      const json = await apiRes.json();
      const dl = json?.result?.download?.url;
      const format = "mp3";

      if (!json?.result?.status ||!dl) return m.reply("❌ *El Elfo de Audio no encontró el villancico.*");

      await conn.sendMessage(m.chat, {
        audio: { url: dl},
        mimetype: "audio/mpeg",
        fileName: `${title}.${format}`
}, { quoted: m});

      // Reacción de éxito de audio
      await m.react("🎧");
}

    if (command === "play2" || command === "playvid") {
      const apiRes = await fetch(`https://api.vreden.my.id/api/v1/download/play/video?query=${encodeURIComponent(text.trim())}`);
      const json = await apiRes.json();
      const dl = json?.result?.download?.url;

      if (!json?.result?.status ||!dl) return m.reply("❌ *El Trineo de Video falló al cargar la peli.*");

      const fileRes = await fetch(dl);
      const sizeMB = parseInt(fileRes.headers.get("Content-Length") || 0) / (1024 * 1024);
      const sendAsDoc = sizeMB>= limit;

      await conn.sendMessage(m.chat, {
        video: { url: dl},
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: ""
}, { quoted: m});

      // Reacción de éxito de video festiva
      await m.react("🎅");
}

} catch (error) {
    console.error("❌ Error:", error);
    m.reply("⚠️ *Ocurrió un error mágico al procesar tu regalo. Intenta de nuevo.*");
}
};

handler.help = ["play <texto o URL>", "play2", "playvid"];
handler.tags = ["descargas", "youtube"];
handler.command = ["play", "play2", "playvid"];

export default handler;
