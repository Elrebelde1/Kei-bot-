
import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, args, command}) => {
  const apikey = 'sylphy-8238wss'
  let imageUrl = args[0]

  // Si el usuario responde a una imagen
  if (!imageUrl && m.quoted?.mimetype?.startsWith('image/')) {
    try {
      const media = await conn.downloadMediaMessage(m.quoted)
      const form = new FormData()
      form.append('file', media, 'image.jpg')
      form.append('reqtype', 'fileupload')

      const uploadRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
})
      imageUrl = await uploadRes.text()
} catch (e) {
      console.error('❌ Error al subir la imagen:', e)
      return m.reply('⚠️ No se pudo obtener la imagen. Asegúrate de responder a una imagen válida.')
}
}

  // Si no hay URL válida
  if (!imageUrl) {
    return m.reply(`📌 *Uso correcto:*\n.${command} <url de imagen>\nO responde a una imagen con.${command}`)
}

  try {
    const upscaleUrl = `https://api.sylphy.xyz/tools/upscale?url=${encodeURIComponent(imageUrl)}&apikey=${apikey}`
    const res = await fetch(upscaleUrl)
    const buffer = await res.buffer()

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🖼 Imagen mejorada con resolución HD\n🔗 Fuente: Sylphy API`
}, { quoted: m})
} catch (e) {
    console.error('❌ Error al mejorar la imagen:', e)
    m.reply('⚠️ No se pudo procesar la imagen. Asegúrate de que el enlace sea válido y accesible.')
}
}

handler.help = ['hd <url de imagen>']
handler.tags = ['tools']
handler.command = /^hd$/i

export default handler