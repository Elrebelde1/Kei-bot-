
import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn, args}) => {
  if (!args[0]) throw `
╭━━━〔 ⚔️ *KEISTOP' VERSUS* ⚔️ 〕━━━┓
┃
┃ ⏳ *HORARIO:*
┃ 🇲🇽 MÉXICO: 
┃ 🇨🇴 COLOMBIA: 
┃
┃ 🎮 *MODALIDAD:*
┃ 👥 *JUGADORES:* 12 VS 12
┃
┃ 🏆 *ESCUADRA A:*
┃    👑 • 
┃    ⚡ • (11 espacios disponibles)
┃
┃ 🏆 *ESCUADRA B:*
┃    👑 • 
┃    ⚡ • (11 espacios disponibles)
┃
┃ 💬 *Usa:* .12vs12 [hora]
┗━━━━━━━━━━━━━━━━━━━━━━━┛
`

  const textos = [
    "👾 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓: GUERRA TOTAL",
    "⚔️ MASACRE 12VS12 ACTIVADA",
    "🚀 SYSTEM KEISTOP: CONFLICTO MASIVO"
  ]
  
  const imgOficial = "https://files.catbox.moe/hnlnna.jpg"
  const titulo = textos[Math.floor(Math.random() * textos.length)]
  
  let thumbBuffer
  try {
    const res = await axios.get(imgOficial, { responseType: 'arraybuffer'})
    thumbBuffer = Buffer.from(res.data)
  } catch (err) {
    thumbBuffer = Buffer.from('')
  }

  const keistopMsg = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      orderMessage: {
        itemCount: 2026,
        status: 1,
        message: titulo,
        footerText: "𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾",
        thumbnail: thumbBuffer,
        surface: 2,
        sellerJid: "0@s.whatsapp.net"
      }
    }
  }

  const caption = `
┏━━━━〔 👾 *KEISTOP' 12 VS 12* 👾 〕━━━┓
┃
┃ ⏳ *HORARIOS:*
┃ 🇲🇽 MÉXICO: ${args[0]}
┃ 🇨🇴 COLOMBIA: ${args[0]}
┃
┃ 🎮 *MODALIDAD:*
┃ 👥 *JUGADORES:* 12 VS 12
┃
┃ 🔱 *ESCUADRA 1:*
┃    👑 • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ • 
┃
┃ 🔱 *ESCUADRA 2:*
┃    👑 • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ •    ⚔️ • 
┃    ⚔️ •    ⚔️ • 
┃
┃ 🚀 *RESERVAS:*
┃    👾 •    👾 •    👾 • 
┃
┃ 👾 *𝐁𝐲: 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

📢 *Canal:* https://whatsapp.com/channel/0029Vb7aYAQJkK7F00EIzB1l`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: imgOficial },
    caption: caption,
    mentions: []
  }, { quoted: keistopMsg })
}

handler.help = ['12vs12']
handler.tags = ['freefire']
handler.command = /^(vs12|12vs12|masc12)$/i
handler.group = true
handler.admin = false

export default handler
