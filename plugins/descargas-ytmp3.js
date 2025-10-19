
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command, usedPrefix}) => {
  const apikey = "sylphy-8238wss"

  if (!text) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <URL de YouTube>\n📍 *Ejemplo:* ${usedPrefix + command} https://youtube.com/watch?v=abc123`)
}

  if (!text.includes("youtube.com")) {
    return m.reply("❌ Por favor, proporciona una URL válida de YouTube.")
}

  const apiUrl = `https://api.sylphy.xyz/download/ytmp3v2?url=${encodeURIComponent(text)}&apikey=sylphy-8238wss`

  try {
    const res = await fetch(apiUrl)
    const json = await res.json()

    const dl = json.dl_url || (json.data? json.data.dl_url: null)
    const title = json.title || (json.data? json.data.title: "Audio de YouTube")

    if (!dl) {
      return m.reply("❌ No se pudo obtener el audio.")
}

    const caption = `
╭─🎧 *YouTube MP3 Downloader* ─╮
│
│ 🎵 *Título:* ${title}
│ 📥 *Descargando audio...*
╰────────────────────────────╯
`

    await conn.sendMessage(m.chat, { text: caption}, { quoted: m})
    await conn.sendMessage(m.chat, {
      audio: { url: dl},
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
}, { quoted: m})

} catch (error) {
    console.error("Error al conectar con la API:", error)
    m.reply("⚠️ Ocurrió un error al intentar descargar el audio.")
}
}

handler.help = ['ytmp3 <url>']
handler.tags = ['audio']
handler.command = /^ytmp3$/i

export default handler