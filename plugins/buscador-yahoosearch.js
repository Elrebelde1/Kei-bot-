import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, '💥 Por favor, proporciona una consulta de búsqueda.', m)
    await m.react('🕒')

    // Construimos la URL de la API con el texto ingresado
    const apiUrl = `https://delirius-apiofc.vercel.app/search/yahoo?query=${encodeURIComponent(text)}&language=en`

    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.data?.length) throw '⚠ No se encontraron resultados.'

    // Tomamos las primeras descripciones y las unimos en un mensaje
    const results = json.data.map((item, i) => `🔎 *Resultado ${i+1}:*\n${item.description}`).join('\n\n')

    await conn.reply(m.chat, `> 📡 *Resultados de YahooSearch para:* ${text}\n\n${results}`, m)
    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, typeof e === 'string' ? e : '⚠ Ocurrió un error al procesar la búsqueda.', m)
  }
}

handler.command = handler.help = ['yahoosearch']
handler.tags = ['buscador']
handler.group = false // cámbialo a true si quieres que solo funcione en grupos

export default handler