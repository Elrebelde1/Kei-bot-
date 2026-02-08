import axios from 'axios'

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw `
╭─❍ *💥 RETO 6 VS 6 💥*
│
│⏳ *Horario:*
│🇲🇽 MÉXICO:
│🇨🇴 COLOMBIA:
│
│🎮 *Modalidad:*
│👥 *Jugadores:*
│
│🏆 *Escuadra 1:*
│   👑 •
│   🥷🏻 •
│   🥷🏻 •
│   🥷🏻 •
│   🥷🏻 •
│   🥷🏻 •
│
│🔄 *Suplentes:*
│   🥷🏻 •
│   🥷🏻 •
╰─────────────────❍
`

  const mensajes = [
    "🔥 COMBATE PREPARADO | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓",
    "⚡ RETO ACTIVO | ORGANIZACIÓN FF",
    "💣 LLAMADO GRUPAL | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓"
  ]
  
  // Imagen oficial para miniaturas
  const imgOficial = "https://files.catbox.moe/hnlnna.jpg"

  const textoRandom = mensajes[Math.floor(Math.random() * mensajes.length)]

  let thumbBuffer
  try {
    const res = await axios.get(imgOficial, { responseType: 'arraybuffer'})
    thumbBuffer = Buffer.from(res.data)
  } catch (err) {
    console.error("Error al cargar imagen de miniatura:", err)
    thumbBuffer = Buffer.from('')
  }

  const keistop = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      orderMessage: {
        itemCount: 6,
        status: 1,
        message: textoRandom,
        footerText: "𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾",
        thumbnail: thumbBuffer,
        surface: 2,
        sellerJid: "0@s.whatsapp.net"
      }
    }
  }

  await conn.sendMessage(m.chat, {
    image: { url: imgOficial },
    caption: `╭─❍ *💥 6 VS 6 | RETO* 💥
│
│⏳ *Horario:*
│🇲🇽 MÉXICO: ${args[0]}
│🇨🇴 COLOMBIA: ${args[0]}
│
│🎮 *Modalidad:*
│👥 *Jugadores:*
│
│🏆 *Escuadra 1:*
│   👑 • 
│   🥷🏻 • 
│   🥷🏻 • 
│   🥷🏻 • 
│   🥷🏻 • 
│   🥷🏻 • 
│
│🔄 *Suplentes:*
│   🥷🏻 • 
│   🥷🏻 • 
│
│👾 *𝐁𝐲: 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓*
╰─────────────────❍

📢 *Canal:* https://whatsapp.com/channel/0029Vb7aYAQJkK7F00EIzB1l`,
    mentions: []
  }, { quoted: keistop })
}

handler.help = ['6vs6']
handler.tags = ['freefire']
handler.command = /^(vs6|6vs6|masc6)$/i
handler.group = true
handler.admin = true

export default handler
