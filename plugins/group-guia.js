const handler = async (m, { isPrems, conn }) => {
  const cooldown = 24 * 60 * 60 * 1000 // 24 horas en ms
  const last = global.db.data.users[m.sender].lastcofre || 0
  const now = Date.now()
  const time = last + cooldown

  // Mensaje de espera con temática de 'regalo' o 'cofre navideño'
  if (now < time) {
    throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴 𝙽𝙰𝚅𝙸𝙳𝙴𝙽̃𝙾 🎁\n𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - now)}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁 𝙾𝚃𝚁𝙾 𝚁𝙴𝙶𝙰𝙻𝙾.`
  }

  const img = 'https://qu.ax/Ny958'
  const texto = `
🎄❄️ *𝐆𝐮í𝐚 𝐝𝐞 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐅𝐞𝐬𝐭𝐢𝐯𝐨𝐬* 🎅🌟
––––––––––––––––––––––––––––––––––––––

_¡Prepara tu grupo para la Navidad con estos comandos de Elfo!_

.𝘰𝘯/𝘰𝘧𝘧 𝘢𝘶𝘥𝘪𝘰𝘴 🎶
.𝘵𝘰𝘥𝘰𝘴 👨‍👩‍👧‍👦
*(Santa llama a sus Duendes)* 
.𝘯𝘰𝘵𝘪 𝘺 𝘮𝘦𝘯𝘴𝘢𝘫𝘦 ✉️
*(Notifica a los duendes sin mención)*
.𝘨𝘳𝘶𝘱𝘰 𝘢𝘣𝘳𝘪𝘳/𝘤𝘦𝘳𝘳𝘢𝘳 ➡️⬅️
*(Abre/Cierra el Taller de Juguetes)* 
.𝘧𝘢𝘯𝘵𝘢𝘴𝘮𝘢𝘴 👤
*(Muestra a los Duendes inactivos)* 
.𝘰𝘯/𝘰𝘧𝘧 𝘸𝘦𝘭𝘤𝘰𝘮𝘦 👋
*(Activa Saludos y Despedidas de Navidad)* 
.𝘴𝘦𝘵𝘸𝘦𝘭𝘤𝘰𝘮𝘦 𝘛𝘦𝘹𝘵𝘰 @𝘶𝘴𝘦𝘳 ✍️
*(Mensaje de bienvenida del Polo Norte)* 
.𝘴𝘦𝘵𝘣𝘺𝘦 𝘛𝘦𝘹𝘵𝘰 @𝘶𝘴𝘦𝘳 🚶‍♂️
*(Despedida de Duendes en el Trineo)* 
.𝘱𝘳𝘰𝘮𝘰𝘵𝘦 *@𝘵𝘢𝘨* ✨
*(Convierte a alguien en Elfo Jefe)* 
.𝘥𝘦𝘮𝘰𝘵𝘦 *@𝘵𝘢𝘨* 🚫
*(Le quita el gorro de Elfo Jefe)* 
.𝘰𝘯 𝘮𝘰𝘥𝘰𝘢𝘥𝘮𝘪𝘯 🔒
*(Bot solo para Elfos Jefes)* 
.𝘰𝘧𝘧 𝘮𝘰𝘥𝘰𝘢𝘥𝘮𝘪𝘯 🔓
*(Bot para uso general en el Taller)* 
.𝘣𝘰𝘵 𝘛𝘦𝘹𝘵𝘰 💬
*(Habla con el Bot navideño)* 
.𝘥𝘦𝘭 🗑️
*(Elimina un regalo mal envuelto)* 
.𝘮𝘦𝘯𝘶 📚
*(Muestra todos los Regalos Comandos)*

𝘋𝘶𝘥𝘢/𝘪𝘮𝘱𝘭𝘦𝘮𝘦𝘯𝘵𝘰́:
wa.me/584146277368 🧑‍💻
`

  await conn.sendMessage(m.chat, { image: { url: img }, caption: texto }, { quoted: m })

  // Actualizar última vez
  global.db.data.users[m.sender].lastcofre = now
}

handler.command = ['guia']
handler.register = false
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