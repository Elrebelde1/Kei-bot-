
import fetch from 'node-fetch'

const SYLPHY_API_KEY = 'sylphy-8238wss'

async function buscarCancion(nombre) {
  const url = `https://api.sylphy.xyz/search/spotify?q=${encodeURIComponent(nombre)}&apikey=sylphy-8238wss `
  const res = await fetch(url)
  const json = await res.json()
  if (!json.status ||!json.data || json.data.length === 0) throw new Error('No se encontraron resultados')
  return json.data[0] // Devuelve el primer resultado
}

async function descargarCancion(spotifyUrl) {
  const url = `https://api.sylphy.xyz/download/spotify?url=${encodeURIComponent(spotifyUrl)}&apikey='sylphy-8238wss`
  const res = await fetch(url)
  const json = await res.json()
  if (!json.status ||!json.data ||!json.data.dl_url) throw new Error('No se pudo descargar la canción')
  return json.data
}

async function procesarSpotify(texto, conn, m) {
  try {
    const esUrl = texto.includes('open.spotify.com/track')
    const track = esUrl? { url: texto}: await buscarCancion(texto)
    const info = await descargarCancion(track.url)

    const mensaje = `
🎶 *Spotify Downloader*
📌 *Título:* ${info.title}
🎤 *Artista:* ${info.author || 'Desconocido'}
⏱️ *Duración:* ${info.duration || 'N/A'}
🔗 *Enlace:* ${track.url}
📥 *Descargando audio...*
`

    await conn.sendMessage(m.chat, { image: { url: info.image}, caption: mensaje}, { quoted: m})
    await conn.sendMessage(m.chat, {
      audio: { url: info.dl_url},
      mimetype: 'audio/mp4',
      fileName: `${info.title}.m4a`
}, { quoted: m})

} catch (error) {
    console.error(error)
    m.reply(`❌ Error: ${error.message}`)
}
}

const handler = async (m, { conn, text}) => {
  if (!text) return m.reply('📌 Escribe el nombre de la canción o pega el enlace de Spotify.')
  await procesarSpotify(text, conn, m)
}

handler.help = ['spotify <nombre o URL>']
handler.tags = ['music']
handler.command = /^spotify$/i

export default handler