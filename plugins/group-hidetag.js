import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants, isAdmin }) => {
  if (!isAdmin) return m.reply('🚫 Este comando solo puede usarlo un administrador del grupo.')

  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  let contenido = text || q.text || '📢 ¡Atención a todos!'

  // Generamos el mensaje con la estructura de Business Verificado para kei
  const msg = await generateWAMessageFromContent(m.chat, {
    extendedTextMessage: {
      text: contenido,
      contextInfo: {
        mentionedJid: users,
        isForwarded: true,
        forwardingScore: 999,
        externalAdReply: {
          title: 'Keisitop ✅',
          body: 'Notificación Oficial del Grupo',
          thumbnailUrl: 'https://files.catbox.moe/gjvmer.jpg',
          sourceUrl: 'https://www.whatsapp.com/',
          mediaType: 1,
          renderLargerThumbnail: false 
        }
      }
    }
  }, { 
    quoted: {
      key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' },
      message: { 
        conversation: "Hola Soy Keistop bot" 
      }
    },
    userJid: conn.user.id 
  })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'notify', 'n', 'noti']
handler.group = true
handler.admin = true

export default handler