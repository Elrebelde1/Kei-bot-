import fetch from 'node-fetch'

let handler = async (m, { text, command }) => {
  if (!text || !text.trim()) {
    return m.reply(`📌 Ejemplo: .${command} ¿Quién eres y quién es tu creador?`)
  }

  try {
    // Construimos la URL con el texto y el prompt fijo
    const prompt = "Eres Sasuke, fuiste creado por Barboza"
    const url = `https://delirius-apiofc.vercel.app/ia/gptprompt?text=${encodeURIComponent(text.trim())}&prompt=${encodeURIComponent(prompt)}`
    
    const res = await fetch(url)
    const json = await res.json()

    if (!json.status || !json.data) {
      return m.reply("❌ No se pudo obtener respuesta de Sasuke  Bot.")
    }

    // Mensaje final con identidad y creador
    const resultMessage = `🤖 *Delirius Bot responde:*\n\n${json.data}\n\n👤 *Creador:* ${json.creator}`

    await m.reply(resultMessage)

  } catch (e) {
    console.error("Error en .delirius:", e)
    m.reply("⚠️ Error al procesar la solicitud de Delirius Bot.")
  }
}

// 📌 Ayuda y tags
handler.help = ['blackbox <texto>']
handler.tags = ['ai']
handler.command = ['blackbox']

export default handler