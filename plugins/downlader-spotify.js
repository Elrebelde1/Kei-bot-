
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command, usedPrefix}) => {
  if (!text) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <nombre de canción o URL de Spotify>\n📍 *Ejemplo:* ${usedPrefix + command} lupita\n📍 *Ejemplo:* ${usedPrefix + command} https://open.spotify.com/track/...`);
}

  // Si es una URL directa de Spotify
  if (text.includes("open.spotify.com/track")) {
    try {
      const res = await fetch(`https://api.vreden.my.id/api/v1/download/spotify?url=${encodeURIComponent(text)}`);
      const json = await res.json();

      const song = json.result;
      if (!song ||!song.download) {
        return m.reply("❌ No se pudo descargar la canción.");
}

      const caption = `
╭─🎶 *Spotify Downloader* 🎶─╮
│
│ 🎵 *Título:* ${song.title}
│ 👤 *Autor:* ${song.artists}
│ 💽 *Álbum:* ${song.album}
│ 📅 *Lanzamiento:* ${song.release_date}
│ ⏱️ *Duración:* ${(song.duration_ms / 60000).toFixed(2)} min
│ 📥 *Descargando audio...*
╰────────────────────────────╯
`;

      await conn.sendMessage(m.chat, { image: { url: song.cover_url}, caption}, { quoted: m});
      await conn.sendMessage(m.chat, {
        audio: { url: song.download},
        mimetype: 'audio/mpeg',
        fileName: `${song.title}.mp3`
}, { quoted: m});

} catch (e) {
      console.error(e);
      m.reply("⚠️ Error al descargar la canción.");
}
    return;
}

  // Si es texto, buscar y descargar automáticamente el primer resultado
  try {
    const res = await fetch(`https://api.vreden.my.id/api/v1/search/spotify?query=${encodeURIComponent(text)}&limit=10`);
    const json = await res.json();

    const track = json.result?.search_data?.[0];
    if (!track ||!track.song_link) {
      return m.reply("❌ No se encontraron canciones.");
}

    const downloadRes = await fetch(`https://api.vreden.my.id/api/v1/download/spotify?url=${encodeURIComponent(track.song_link)}`);
    const downloadJson = await downloadRes.json();
    const song = downloadJson.result;

    if (!song ||!song.download) {
      return m.reply("❌ No se pudo descargar el audio.");
}

    const caption = `
╭─🎶 *Spotify Downloader* 🎶─╮
│
│ 🎵 *Título:* ${song.title}
│ 👤 *Autor:* ${song.artists}
│ 💽 *Álbum:* ${song.album}
│ 📅 *Lanzamiento:* ${song.release_date}
│ 🔗 *Enlace:* ${track.song_link}
│ 📥 *Descargando audio...*
╰────────────────────────────╯
`;

    await conn.sendMessage(m.chat, { image: { url: song.cover_url}, caption}, { quoted: m});
    await conn.sendMessage(m.chat, {
      audio: { url: song.download},
      mimetype: 'audio/mpeg',
      fileName: `${song.title}.mp3`
}, { quoted: m});

} catch (e) {
    console.error(e);
    m.reply("⚠️ Error al buscar o descargar la canción.");
}
};

handler.help = ['spotify <texto o URL>'];
handler.tags = ['music'];
handler.command = /^spotify$/i;

export default handler;