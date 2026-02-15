import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return true;

    const chat = global.db?.data?.chats?.[m.chat];
    if (!chat || !chat.bienvenida) return true;

    // --- ✅ Nueva imagen actualizada ---
    const defaultImageUrl = 'https://files.catbox.moe/gjvmer.jpg'; 

    const get_default_image_buffer = async () => {
        return await fetch(defaultImageUrl).then(res => res.buffer());
    };
    // ----------------------------------------

    const fkontak = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'KeistopBot'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:𝐊𝐄𝐈𝐒𝐓𝐎𝐏 𝐁𝐎𝐓\nitem1.TEL;waid=${
            conn.user.jid.split('@')[0]
          }:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    let userJid;
    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        userJid = m.messageStubParameters?.[0];
        break;
      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        userJid = m.key.participant;
        break;
      default:
        return true;
    }

    if (!userJid) return true;

    const user = `@${userJid.split('@')[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'Sin descripción disponible.';

    const imgBuffer = await get_default_image_buffer();
    const { customWelcome, customBye, customKick } = chat;

    // --- 🟢 BIENVENIDA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = customWelcome
        ? customWelcome.replace(/@user/gi, user).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc)
        : `✨ *¡BIENVENIDO/A!* ✨\n\nHola ${user}, es un gusto tenerte en *${groupName}*.\n\n📝 *REGLAS Y INFO:*\n${groupDesc}\n\n⚡ *𝐊𝐄𝐈𝐒𝐓𝐎𝐏 𝐁𝐎𝐓*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: welcomeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🔴 SALIDA VOLUNTARIA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const goodbyeText = customBye
        ? customBye.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `👋 *¡ADIÓS!* 🚶‍♂️\n\n${user} ha dejado el grupo por su cuenta.\nEsperamos verte pronto en *${groupName}*.`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: goodbyeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🚫 ELIMINADO ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const kickText = customKick
        ? customKick.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `🚫 *¡EXPULSADO!* ⚡\n\n${user} fue eliminado del grupo *${groupName}*.\n¡Sigue las reglas para evitar esto!`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: kickText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }
  } catch (error) {
    console.error('❌ Error en el sistema de bienvenida:', error);
  }
}
