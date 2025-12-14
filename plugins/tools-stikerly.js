
import fetch from "node-fetch";

let handler = async (m, { text}) => {
  if (!text) return m.reply("❗ Ingresa un número o enlace para verificar.");

  try {
    const apiUrl = `https://io.tylarz.top/v1/bancheck?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();

    if (data?.banned) {
      return m.reply("🚫 El número o enlace está *baneado*.");
} else {
      return m.reply("✅ El número o enlace *no está baneado*.");
}
} catch (error) {
    console.error("Error al verificar:", error);
    return m.reply(`⚠️ Error al verificar: ${error.message}`);
}
};

handler.help = ["bancheck <número o enlace>"];
handler.tags = ["utilidades"];
handler.command = ["ban"];

export default handler;