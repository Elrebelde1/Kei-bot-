import axios from 'axios'

let handler = async (m, { conn, args}) => {
  if (!args[0]) throw `
╭─❍ *🔥 RETO 24 VS 24 | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾*
│
│⏳ *Horario:*
│🇲🇽 MÉXICO:
│🇨🇴 COLOMBIA:
│
│🎮 *Modalidad:*
│👥 *Jugadores:* 24 VS 24
│
│🥷 *Escuadra 1:*
│   👑 • (4 espacios)
│
│🥷 *Escuadra 2:*
│   👑 • (4 espacios)
│
│🥷 *Escuadra 3:*
│   👑 • (4 espacios)
│
│🥷 *Escuadra 4:*
│   👑 • (4 espacios)
│
│🥷 *Escuadra 5:*
│   👑 • (4 espacios)
│
│🥷 *Escuadra 6:*
│   👑 • (4 espacios)
│
│🔄 *Suplentes:*
│   🥷🏻 •
╰────────────────────❍
`

  const encabezados = [
    "🎖️ RETO CLAN VS CLAN | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓",
    "🔥 BATALLA TOTAL ACTIVADA",
    "⚡ ALIANZA MULTIESCUADRA EN PROGRESO"
  ]
  
  const imgOficial = "https://files.catbox.moe/hnlnna.jpg"
  const titulo = encabezados[Math.floor(Math.random() * encabezados.length)]

  let thumbBuffer = Buffer.alloc(0)
  try {
    const res = await axios.get(imgOficial, { responseType: 'arraybuffer'})
    thumbBuffer = Buffer.from(res.data)
  } catch (e) {
    console.log("Error al cargar imagen:", e)
  }

  const keistopMsg = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      orderMessage: {
        itemCount: 24,
        status: 1,
        message: titulo,
        footerText: "𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾",
        thumbnail: thumbBuffer,
        surface: 2,
        sellerJid: "0@s.whatsapp.net"
      }
    }
  }

  await conn.sendMessage(m.chat, {
    image: { url: imgOficial },
    caption: `╭─❍ *🔥 24 VS 24 | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓*
│
│⏳ *Horario:*
│🇲🇽 MÉXICO: ${args[0]}
│🇨🇴 COLOMBIA: ${args[0]}
│
│🎮 *Modalidad:*
│👥 *Jugadores:* 24 VS 24
│
│🥷 *Escuadra 1:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🥷 *Escuadra 2:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🥷 *Escuadra 3:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🥷 *Escuadra 4:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🥷 *Escuadra 5:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🥷 *Escuadra 6:*
│   👑 •    🥷🏻 •    🥷🏻 •    🥷🏻 • 
│
│🔄 *Suplentes:*
│   🥷🏻 •    🥷🏻 • 
│
│👾 *𝐁𝐲: 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓*
╰────────────────────❍

📢 *Canal:* https://whatsapp.com/channel/0029Vb7aYAQJkK7F00EIzB1l`,
    mentions: []
}, { quoted: keistopMsg })
}

handler.help = ['24vs24']
handler.tags = ['freefire']
handler.command = /^(vs24|24vs24)$/i
handler.group = true

export default handler
