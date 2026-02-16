import { readFileSync } from 'fs';
import { join } from 'path';

const handler = async (m, { isPrems, conn }) => {
  try {
    // Registro de tiempo
    const last = global.db.data.users[m.sender].lastcofre || 0
    const now = new Date() * 1
    const cooldown = 0 // Puedes cambiar esto por milisegundos si quieres delay

    if (now - last < cooldown) {
      const wait = msToTime((last + cooldown) - now)
      throw `⏳ El sistema está procesando otros pedidos. Vuelve en *${wait}*.`
    }

    // Definir la ruta de la imagen local y leerla como Buffer
    const img = readFileSync(join(process.cwd(), 'storage', 'img', 'catalogo.png'));

    const texto = `
🎨💎 *𝕄𝔼ℕ𝕌́ 𝔻𝔼 𝔻𝕀𝕊𝔼ℕ̃𝕆𝕊 - 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'* 💎🎨
––––––––––––––––––––––––––––––––––––––

_¡Crea logos increíbles con un solo comando!_
_Uso: .comando (texto)_

*✨ ESTILOS DE TEXTO:*
▸ .logoneon (texto)
▸ .logoglitch (texto)
▸ .logograffiti3d (texto)
▸ .logomatrix (texto)
▸ .logofuturista (texto)
▸ .logocielo (texto)

*🎮 GAMING & PERSONAJES:*
▸ .logogaming (texto)
▸ .logonaruto (texto)
▸ .logodragonball (texto)
▸ .logoarmy (texto)
▸ .logopubg (texto)
▸ .logopubgfem (texto)
▸ .logoguerrero (texto)
▸ .logolol (texto)
▸ .logoamongus (texto)

*🎭 EFECTOS Y REDES:*
▸ .tweet (comentario)
▸ .sadcat (texto)
▸ .logocorazon (texto)
▸ .logopareja (texto)
▸ .logoalas (texto)
▸ .logonube (texto)
▸ .logohorror (texto)

*🎬 MULTIMEDIA:*
▸ .logoportadaplayer (texto)
▸ .logoportadaff (texto)
▸ .logovideotiger (texto)
▸ .logovideointro (texto)
▸ .logovideogaming (texto)

––––––––––––––––––––––––––––––––––––––
_🚀 ¡Genera tu identidad con 𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓!_
`.trim()

    // Enviar imagen local + caption
    await conn.sendMessage(m.chat, { 
      image: img, 
      caption: texto 
    }, { quoted: m })

    // Actualizar última vez en la DB
    global.db.data.users[m.sender].lastcofre = now

  } catch (e) {
    console.error(e)
    if (typeof e === 'string') throw e // Re-lanzar el mensaje del cooldown
    await conn.reply(m.chat, '❌ Hubo un fallo al cargar el menú de logos.', m)
  }
}

handler.help = ['menu3']
handler.tags = ['main', 'logo']
handler.command = ['menulogos', 'logos', 'menu3'] 

export default handler

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return `${hours}h ${minutes}m ${seconds}s`
}
