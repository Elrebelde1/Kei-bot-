import fg from 'api-dylux'
import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn, args, command, usedPrefix}) => {
  if (!args[0]) throw `
╭─❍ *👾 RETO 4 VS 4 👾*
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
│
│🧱 *Suplentes:*
│   🥷🏻 •
│   🥷🏻 •
╰───────────────❍
`

  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'KeistopVS'
    },
    message: {
      locationMessage: {
        name: '𝐊𝐄𝐈𝐒𝐓𝐎𝐏\'  𝐁𝐎𝐓 👾',
        jpegThumbnail: await (await fetch('https://files.catbox.moe/hnlnna.jpg')).buffer(),
        vcard:
          'BEGIN:VCARD\n' +
          'VERSION:3.0\n' +
          'N:;Keistop;;;\n' +
          'FN:𝐊𝐄𝐈𝐒𝐓𝐎𝐏\'  𝐁𝐎𝐓\n' +
          'ORG:𝐊𝐄𝐈𝐒𝐓𝐎𝐏\' 𝐂𝐨𝐦𝐮𝐧𝐢𝐭𝐲\n' +
          'TITLE:\n' +
          'item1.TEL;waid=5491100000000:+54 9 11 0000-0000\n' +
          'item1.X-ABLabel:KeistopBot\n' +
          'X-WA-BIZ-DESCRIPTION:Sistema oficial de 𝐊𝐄𝐈𝐒𝐓𝐎𝐏\'  𝐁𝐎𝐓\n' +
          'X-WA-BIZ-NAME:𝐊𝐄𝐈𝐒𝐓𝐎𝐏\'  𝐁𝐎𝐓\n' +
          'END:VCARD'
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: '🎯 *Reto grupal activo | 𝐊𝐄𝐈𝐒𝐓𝐎𝐏\'  𝐁𝐎𝐓 👾*',
  }, { quoted: fkontak })

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/hnlnna.jpg' },
    caption: `╭─❍ *4 VS 4 | RETO* 🔥
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
│
│🧱 *Suplentes:*
│   🥷🏻 • 
│   🥷🏻 • 
│
│👾 *𝐁𝐲: 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓*
╰───────────────❍

📢 *Canal:* https://whatsapp.com/channel/0029Vb7aYAQJkK7F00EIzB1l`,
    mentions: []
  }, { quoted: fkontak })
}

handler.help = ['4vs4']
handler.tags = ['freefire']
handler.command = /^(vs4|4vs4|masc4)$/i
handler.group = true

export default handler
