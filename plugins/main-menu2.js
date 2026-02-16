import { readFileSync } from 'fs';
import { join } from 'path';

const handler = async (m, { conn }) => {
  try {
    // Leemos la imagen localmente desde la ruta especificada
    const img = readFileSync(join(process.cwd(), 'storage', 'img', 'catalogo.png'));

    const texto = `
*╭━━〔 🎵 CAJA MUSICAL 🎵 〕━━╮*
*┃*
*┃* ¡𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾!
*┃* ➢ 🔔 𝘼𝙪𝙙𝙞𝙤𝙨 𝙀𝙭𝙘𝙡𝙪𝙨𝙞𝙫𝙤𝙨
*┃*
*┣━━〔 🎶 CATEGORÍAS 🎶 〕━━*
*┃*
*┃* 🎭 *MEMES Y FRASES*
*┃* ➢ _El Pepe, Basado, Potasio_
*┃* ➢ _Eso va ser epico papus_
*┃* ➢ _Se estan riendiendo de mi_
*┃* ➢ _Diagnosticado con Gay_
*┃* ➢ _Usted es feo, Ara Ara_
*┃*
*┃* 🗣️ *REACCIONES*
*┃* ➢ _WTF, OMG, ZZZZ, Joder_
*┃* ➢ _Nadie te pregunto_
*┃* ➢ _Que onda, Mmmm, Hey_
*┃* ➢ _Bien pensado Woody_
*┃*
*┃* 🎤 *AUDIOS CLÁSICOS*
*┃* ➢ _Chambear, Mudo, Onichan_
*┃* ➢ _Siuuu, Yamete, Pikachú_
*┃* ➢ _Ma ma masivo, Taka taka_
*┃* ➢ _Tunometecabrasaramambiche_
*┃*
*┃* 👋 *SALUDOS*
*┃* ➢ _Buenos días, Buenas noches_
*┃* ➢ _Bienvenido wey, Hola_
*┃* ➢ _Feliz cumpleaños_
*┃*
*┃* ⚠️ *ADVERTENCIA*
*┃* _Escribe el nombre exacto_
*┃* _del audio para reproducirlo._
*┃*
*╰━━━━━━━━━━━━━━━━━━╯*`.trim();

    await conn.sendMessage(m.chat, { 
      image: img, // Enviamos el Buffer directamente
      caption: texto 
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    // Mensaje de error por si la imagen no existe en la carpeta
    await conn.reply(m.chat, '❌ No se pudo cargar la imagen del menú de audios.', m);
  }
};

handler.help = ['menu2', 'menuaudios'];
handler.tags = ['main'];
handler.command = ['menu2', 'menuaudios', 'audios'];

export default handler;
