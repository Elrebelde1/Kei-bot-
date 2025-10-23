
import fetch from 'node-fetch'

let handler = async (m, { text, command}) => {
  const apikey = "sylphy-8238wss";

  if (!text ||!text.trim()) {
    return m.reply(`🎨 *Uso correcto:*\n.${command} <descripción de la imagen>\n📍 Ejemplo:.${command} una ola gigante en el océano al atardecer`);
}

  try {
    const prompt = text.trim();
    const url = `https://api.sylphy.xyz/ai/createimg?prompt=${encodeURIComponent(prompt)}&apikey=${apikey}`;
    const res = await fetch(url);
    const buffer = await res.buffer();

    await conn.sendFile(m.chat, buffer, 'imagen.jpg', `🖼️ *Imagen generada con el prompt:*\n"${prompt}"`, m);
} catch (e) {
    console.error("Error en.img:", e);
    m.reply("⚠️ Ocurrió un error al generar la imagen.");
}
};

handler.help = ['crearimg <descripción>'];
handler.tags = ['ai', 'img'];
handler.command = ['img', 'crearimg'];

export default handler;