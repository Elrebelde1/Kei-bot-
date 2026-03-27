import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `_*[ ⚠️ ] 𝐊𝐄𝐈𝐒𝐓𝐎𝐏' 𝐁𝐎𝐓 - Ingresa el nombre de la canción*_\n\n_Ejemplo:_\n${usedPrefix + command} Twice What is Love?`

    try { 
        // 1. FASE DE BÚSQUEDA (SEARCH)
        // Buscamos el término para obtener la URL de Spotify
        const searchRes = await axios.get(`https://api.delirius.store/search/spotify?q=${encodeURIComponent(text)}&limit=1`)
        const searchData = searchRes.data

        if (!searchData.status || !searchData.data || searchData.data.length === 0) {
            throw `_*[ ⚠️ ] No se encontraron resultados para: "${text}"*_`
        }

        // Extraemos la URL del primer resultado del array 'data'
        const trackUrl = searchData.data[0].url

        // 2. FASE DE DESCARGA (DOWNLOAD)
        // Usamos la URL para obtener el enlace directo al MP3
        const downloadRes = await axios.get(`https://api.delirius.store/download/spotify?url=${encodeURIComponent(trackUrl)}`)
        const dlData = downloadRes.data

        if (!dlData.status || !dlData.data) {
            throw `_*[ ❌ ] Error al procesar la descarga con Delirius API.*_`
        }

        // Accedemos a la data final del objeto de descarga
        const res = dlData.data
        
        const info = `
𝐊𝐄𝐈𝐒𝐓𝐎𝐏'  𝐁𝐎𝐓 👾
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝙏𝙄𝙏𝙐𝙇𝙊
» ${res.title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝘼𝙍𝙏𝙄𝙎𝙏𝘼
» ${res.author}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝙀𝙉𝙇𝘼𝘾𝙀
» ${trackUrl}

_*🎶 𝐊𝐄𝐈𝐒𝐓𝐎𝐏' 𝐁𝐎𝐓 está enviando tu audio...*_`.trim()

        // Enviamos la imagen de la portada con la info
        await conn.sendFile(m.chat, res.image, 'thumbnail.jpg', info, m)

        // Enviamos el archivo de audio (MP3)
        await conn.sendMessage(m.chat, { 
            audio: { url: res.download }, 
            fileName: `${res.title}.mp3`, 
            mimetype: 'audio/mpeg' 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        let errorMsg = e.message || 'Error en la API'
        await conn.reply(m.chat, `❌ _*Ocurrió un error:*_\n${errorMsg}`, m)
    }
}

handler.help = ['spotify']
handler.tags = ['descargas']
handler.command = ['spoti', 'spotify', 'play2']

export default handler
