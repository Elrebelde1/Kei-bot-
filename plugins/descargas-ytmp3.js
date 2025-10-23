
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command}) => {
  const emoji = '🎶';
  const errorEmoji = '❌';
  const apiKey = 'sylphy-8238wss';

  if (!text || (!text.includes('youtube.com') &&!text.includes('youtu.be'))) {
    return conn.reply(m.chat, `${errorEmoji} *Enlace inválido.*\n\n📌 *Uso correcto:*\n${usedPrefix + command} <enlace de YouTube>\n📍 *Ejemplo:* ${usedPrefix + command} https://youtu.be/zYwGL6qOON4`, m);
}

  await m.react('⏳');

  try {
    const encodedUrl = encodeURIComponent(text.trim());
    const apiUrl = `https://api.sylphy.xyz/download/ytmp3v2?url=${encodedUrl}&apikey=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const result = await response.json();
    const data = result?.data;

    if (!result.status ||!data?.dl_url) {
      return conn.reply(m.chat, `${errorEmoji} No se pudo obtener el audio. Intenta con otro video.`, m);
}

    const caption = [
      `${emoji} *Audio de YouTube*`,
      `🎵 *Título:* ${data.title}`,
      `📁 *Formato:* ${data.format.toUpperCase()}`,
      `📥 *Tamaño:* ${data.size || 'Desconocido'}`
    ].join('\n');

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: data.dl_url},
        mimetype: 'audio/mpeg',
        fileName: `${data.title}.${data.format}`,
        ptt: false
},
      { quoted: m}
);

    await conn.reply(m.chat, caption, m);
    await m.react('✅');
} catch (err) {
    console.error(err);
    await conn.reply(m.chat, `${errorEmoji} *Error:* ${err.message || 'No se pudo procesar la solicitud.'}`, m);
    await m.react('⚠️');
}
};

handler.help = ['ytmp3 <enlace>'];
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'mp3'];
handler.group = false;

export default handler;