
import fetch from 'node-fetch'

let handler = async (m, { conn, text}) => {
  const apikey = 'sylphy-8238wss'
  if (!text) return m.reply(`📌 Usa:\n.spotify <texto o url>`)

  // Si es una URL de Spotify
  if (text.includes('spotify.com/track')) {
    try {
      const res = await fetch(`https://api.sylphy.xyz/download/spotify?url=${encodeURIComponent(text)}&apikey=sylphy-8238wss`)
      const json = await res.json()

      if (!json ||!json.status ||!json.data ||!json.data.dl_url) {
        return m.reply('❌ No se pudo descargar la canción.')
}

      const { title, dl_url} = json.data

      await conn.sendMessage(m.chat, {
        audio: { url: dl_url},
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
}, { quoted: m})
} catch (e) {
      console.error('❌ Error al descargar desde Spotify:', e)
      m.reply('⚠️ Ocurrió un error al intentar descargar la canción.')
}
    return
}

  // Si es texto para búsqueda
  try {
    const res = await fetch(`https://api.sylphy.xyz/search/spotify?q=${encodeURIComponent(text)}&apikey=sylphy-8238wss`)
    const json = await res.json()

    if (!json ||!json.status ||!json.data || json.data.length === 0) {
      return m.reply('❌ No se encontraron resultados.')
}

    let msg = `🎧 *Resultados de búsqueda para:* "${text}"\n\n`
    for (let track of json.data.slice(0, 5)) {
      msg += `🎵 *${track.title}*\n👤 ${track.artist}\n⏱ ${track.duration}\n🔗 ${track.url}\n\n`
}

    m.reply(msg.trim())
} catch (e) {
    console.error('❌ Error en búsqueda de Spotify:', e)
    m.reply('⚠️ Ocurrió un error al buscar la canción.')
}
}

handler.help = ['spotify <texto o url>']
handler.tags = ['music']
handler.command = /^spotify$/i

export default handler