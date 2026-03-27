import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `_*[ ⚠️ ] 𝐊𝐄𝐈𝐒𝐓𝐎𝐏' 𝐁𝐎𝐓 - Ingresa el nombre de la canción o link*_\n\n_Ejemplo:_\n${usedPrefix + command} Twice Strategy`

    try { 
        // 1. Buscamos el tema para obtener el ID o la URL
        const searchRes = await axios.get(`https://api.delirius.store/search/spotify?q=${encodeURIComponent(text)}&limit=1`)
        const searchData = searchRes.data

        if (!searchData.status || !searchData.data || searchData.data.length === 0) {
            throw `_*[ ⚠️ ] No se encontraron resultados para: "${text}"*_` ?? "Error"
        }

        const track = searchData.data[0]
        const trackUrl = track.url

        // 2. Descargamos la información y el buffer del audio
        const downloadRes = await axios.get(`https://api.delirius.store/download/spotify?url=${encodeURIComponent(trackUrl)}`)
        const dlData = downloadRes.data

        if (!dlData.status) {
            throw `_*[ ❌ ] Error al obtener el enlace de descarga.*_`
        }

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

        // Enviamos la miniatura con la información
        await conn.sendFile(m.chat, res.image, 'thumbnail.jpg', info, m)

        // Enviamos el archivo de audio
        await conn.sendMessage(m.chat, { 
            audio: { url: res.download }, 
            fileName: `${res.title}.mp3`, 
            mimetype: 'audio/mpeg' 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `❌ _*Ocurrió un error: ${e.message || 'API fuera de servicio'}*_`, m)
    }
}

handler.help = ['spotify']
handler.tags = ['descargas']
handler.command = ['spoti', 'spotify', 'play2']

export default handler
