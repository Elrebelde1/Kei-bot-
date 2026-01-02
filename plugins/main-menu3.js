const handler = async (m, { isPrems, conn }) => {
  // Última vez que reclamó
  const last = global.db.data.users[m.sender].lastcofre || 0
  const now = new Date() * 1
  const cooldown = 0 // aquí puedes poner milisegundos de espera si quieres (ej: 3600000 para 1h)

  if (now - last < cooldown) {
    const wait = msToTime((last + cooldown) - now)
    throw `⏳ El Trineo de Santa está ocupado. Vuelve en *${wait}* para reclamar tus regalos.`
  }

  const img = 'https://qu.ax/Ny958' // Imagen navideña
  const texto = `
🎁🔔 *𝕄𝔼ℕ𝕌́ 𝔽𝔼𝕊𝕋𝕀𝕍𝕆 𝔻𝔼 𝕃𝕆𝔾𝕆𝕊* ❄️🎄
––––––––––––––––––––––––––––––––––––––

_¡Crea logos increíbles con un solo comando!_

*Comandos Destacados de Temporada:*
🎄 .logochristmas (texto)
👼 .logoangel (texto)
🌌 .logocielo (texto)

*Otros Estilos Disponibles:*
💖 .logocorazon (texto)
💑 .logopareja (texto)
👾 .logoglitch (texto)
😔 .logosad (texto)
🎮 .logogaming (texto)
🚶‍♂️ .logosolitario (texto)
🐉 .logodragonball (texto)
💡 .logoneon (texto)
🐱 .logogatito (texto)
👧🎮 .logochicagamer (texto)
🎖️ .logoarmy (texto)
🥷 .logonaruto (texto)
🚀 .logofuturista (texto)
☁️ .logonube (texto)
✍️ .logograffiti3d (texto)
💻 .logomatrix (texto)
🔪 .logohorror (texto)
🦅 .logoalas (texto) 
🔫 .logopubg (texto)
⚔️ .logoguerrero (texto)
👸🔫 .logopubgfem (texto)
👑 .logolol (texto)
👽 .logoamongus (texto)
🎧 .logoportadaplayer (texto)
🔥 .logoportadaff (texto)
🐯🎬 .logovideotiger (texto)
🎬✨ .logovideointro (texto)
🎮🎬 .logovideogaming (texto)
😼 .sadcat (texto)
🐦 .tweet (comentario)

––––––––––––––––––––––––––––––––––––––
_¡Felices Fiestas! 🌟 Crea tu logo navideño con \`.logochristmas\`_
`

  // Enviar imagen + caption
  await conn.sendMessage(m.chat, { image: { url: img }, caption: texto }, { quoted: m })

  // Actualizar última vez
  global.db.data.users[m.sender].lastcofre = now
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

  return `${hours} horas ${minutes} minutos ${seconds} segundos`
}