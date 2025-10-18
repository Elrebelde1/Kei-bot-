import fetch from 'node-fetch'

const handler = async (m, { conn, text, command, usedPrefix}) => {
  const apikey = "sylphy-8238wss"

  if (!text) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <URL de YouTube>\n📍 *Ejemplo:* ${usedPrefix + command} https://youtube.com/watch?v=abc123`)
}

  if (!text.includes("youtube.com")) {
    return m.reply("❌ Por favor, proporciona una URL válida de YouTube.")
}

  try {
    const res = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(text)}&apikey=sylphy-8238wss`)
    const json = await res.json()

    if (!json.status ||!json.res ||!json.res.url) {
      return m.reply("❌ No se pudo obtener el video.")
}

    const info = json.res
    const caption = `
╭─🎬 *YouTube MP4 Downloader* ─╮
│
│ 🎞️ *Título:* ${info.title || "Video"}
│ 💽 *Formato:* ${info.format || "MP4"}
│ 📦 *Tamaño:* ${info.filesize || "Desconocido"}
│ 📥 *Descargando video...*
╰────────────────────────────╯
`

    await conn.sendMessage(m.chat, { image: { url: info.thumbnail || ""}, caption}, { quoted: m})
    await conn.sendMessage(m.chat, {
      video: { url: info.url},
      mimetype: 'video/mp4',
      fileName: `${info.title || "video"}.mp4`
}, { quoted: m})

} catch (e) {
    console.error(e)
    m.reply("⚠️ Error al descargar el video.")
}
}

handler.help = ['ytmp4 <url>']
handler.tags = ['video']
handler.command = /^ytmp4$/i

export default handler