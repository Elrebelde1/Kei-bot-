
import fetch from 'node-fetch';
import axios from 'axios';

const handler = async (m, { conn, command, args, text, usedPrefix}) => {
    if (!text) throw `_*[ ⚠️ ] Agrega lo que quieres buscar*_\n\n_Ejemplo:_\n${usedPrefix}${command} Jomblo Happy`;

    try {
        // Buscar en YouTube
        const searchUrl = `https://api.lolhuman.xyz/api/ytsearch?apikey=TuAPIKEY&q=${encodeURIComponent(text)}`;
        const { data} = await axios.get(searchUrl);

        if (!data ||!data.result || data.result.length === 0) {
            throw `_*[ ⚠️ ] No se encontraron resultados para "${text}" en YouTube.*_`;
}

        const video = data.result[0];
        const { title, link, thumbnail, duration, author} = video;

        const info = `⧁ 𝙏𝙄𝙏𝙐𝙇𝙊
» ${title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝗗𝗨𝗥𝗔𝗖𝗜𝗢𝗡
» ${duration}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁  𝘼𝙍𝙏𝙄𝙎𝙏𝘼
» ${author}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝙐𝙍𝙇
» ${link}

_*🎶 Enviando música...*_`.trim();

        await conn.sendFile(m.chat, thumbnail, 'yt.jpg', info, m);

        // Descargar audio
        const dlUrl = `https://api.lolhuman.xyz/api/ytmusic?apikey=TuAPIKEY&url=${encodeURIComponent(link)}`;
        const res = await fetch(dlUrl);
        const result = await res.json();

        if (result && result.result && result.result.link) {
            const audioUrl = result.result.link;
            const filename = `${title || 'audio'}.mp3`;

            await conn.sendMessage(m.chat, {
                audio: { url: audioUrl},
                fileName: filename,
                mimetype: 'audio/mpeg',
                caption: `╭━❰  *YouTube*  ❱━⬣\n${filename}\n╰━❰ *Bot* ❱━⬣`,
                quoted: m
});
} else {
            throw new Error('_*[ ❌ ] Ocurrió un error al descargar el archivo mp3*_');
}

} catch (e) {
        await m.reply(typeof e === 'string'? e: '❌ _*Error inesperado. Intenta nuevamente.*_');
        console.error('❌ Error:', e);
}
};

handler.tags = ['downloader'];
handler.command = ['spotify'];
export default handler;