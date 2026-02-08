import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync} from 'fs'
import path from 'path'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata}) {
    if (!m.messageStubType || !m.isGroup) return

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "KeistopMenu"
        },
        message: {
            locationMessage: {
                name: "𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾",
                jpegThumbnail: await (await fetch('https://files.catbox.moe/hnlnna.jpg')).buffer(),
                vcard:
                    "BEGIN:VCARD\n" +
                    "VERSION:3.0\n" +
                    "N:;𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓;;;\n" +
                    "FN:𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓\n" +
                    "ORG: 𝐊𝐄𝐈𝐒𝐓𝐎𝐏' 𝐂𝐨𝐦𝐮𝐧𝐢𝐭𝐲\n" +
                    "TITLE:\n" +
                    "item1.TEL;waid=5491100000000:+54 9 11 0000-0000\n" +
                    "item1.X-ABLabel:Keistop\n" +
                    "X-WA-BIZ-DESCRIPTION:👾 Sistema de Gestión de Grupos.\n" +
                    "X-WA-BIZ-NAME:𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓\n" +
                    "END:VCARD"
            }
        },
        participant: "0@s.whatsapp.net"
    }

    let chat = global.db.data.chats[m.chat]
    let usuario = `@${m.sender.split`@`[0]}`
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/hnlnna.jpg'

    let nombre = `✨ ${usuario} *ha cambiado el nombre del grupo* ✨\n\n> 📝 *Nuevo nombre:* _${m.messageStubParameters[0]}_`
    let foto = `📸 *¡Nueva foto de grupo!* 📸\n\n> 💫 Acción realizada por: ${usuario}`
    let edit = `⚙️ ${usuario} ha ajustado la configuración del grupo.\n\n> 🔒 Ahora *${m.messageStubParameters[0] == 'on'? 'solo los administradores': 'todos'}* pueden configurar el grupo.`
    let newlink = `🔗 *¡El enlace del grupo ha sido restablecido!* 🔗\n\n> 💫 Acción realizada por: ${usuario}`
    let status = `🗣️ El grupo ha sido *${m.messageStubParameters[0] == 'on'? 'cerrado': 'abierto'}* por ${usuario}!\n\n> 💬 Ahora *${m.messageStubParameters[0] == 'on'? 'solo los administradores': 'todos'}* pueden enviar mensajes.`
    let admingp = `👑 @${m.messageStubParameters[0].split`@`[0]} *¡Ahora es administrador del grupo!* 👑\n\n> 💫 Acción realizada por: ${usuario}`
    let noadmingp = `🗑️ @${m.messageStubParameters[0].split`@`[0]} *ha dejado de ser administrador del grupo.* 🗑️\n\n> 💫 Acción realizada por: ${usuario}`

    if (chat.detect && m.messageStubType == 21) {
        await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 22) {
        await this.sendMessage(m.chat, { image: { url: pp}, caption: foto, mentions: [m.sender]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 23) {
        await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 25) {
        await this.sendMessage(m.chat, { text: edit, mentions: [m.sender]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 26) {
        await this.sendMessage(m.chat, { text: status, mentions: [m.sender]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 29) {
        await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`]}, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 30) {
        await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`]}, { quoted: fkontak})
    } else {
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType],
        })
    }
}

export default handler
