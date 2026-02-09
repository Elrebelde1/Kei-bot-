import { xpRange } from '../lib/levelling.js';
import axios from 'axios';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const saludar = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '✨ ¡Buen día!';
  if (hora >= 12 && hora < 19) return '☄️ ¡Buena tarde!';
  return '🌌 ¡Buena noche!';
};

const img = 'https://files.catbox.moe/hnlnna.jpg'; // Imagen actualizada
const line = '━━━━━━━━━━━━━━━━━━━━';

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 10 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const uptime = clockString(process.uptime() * 1000);
    const tag = `@${m.sender.split('@')[0]}`;

    // Estructura del Menú
    let menu = `
${saludar()} ${tag}

┏━━━━━━━━━━━━━━━━━━━━┓
┃   𝐊𝐄𝐈𝐒𝐓𝐎𝐏  𝐁𝐎𝐓 👾
┗━━━━━━━━━━━━━━━━━━━━┛
  
  ◈ **ESTADO DEL NÚCLEO** ◈
  ⟐ **Nivel:** ${level}
  ⟐ **Progreso:** ${exp - min} / ${xp}
  ⟐ **Diamantes:** ${limit}
  ⟐ **Uptime:** ${uptime}
  
${line}\n`;

    let categorizedCommands = {};
    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tag = Array.isArray(p.tags) ? p.tags[0] : p.tags || 'General';
        const cmds = Array.isArray(p.help) ? p.help : [p.help];
        categorizedCommands[tag] = categorizedCommands[tag] || new Set();
        cmds.forEach(cmd => categorizedCommands[tag].add(usedPrefix + cmd));
      });

    const categoryIcons = {
      anime: '🌸', info: '🛡️', search: '🔍', diversión: '🎮', sticker: '✨',
      descargas: '📥', herramientas: '🔧', otros: '⚙️', config: '🛠️', general: '🌐'
    };

    for (const [title, cmds] of Object.entries(categorizedCommands)) {
      const icon = categoryIcons[title.toLowerCase()] || '◈';
      // Aquí se cambió el rayo por el emoji de la categoría
      menu += `\n ${icon} **${title.toUpperCase()}**\n`;
      cmds.forEach(cmd => {
        menu += `  ▫ ${cmd}\n`;
      });
    }

    menu += `\n${line}\n  *© 𝐊𝐄𝐈𝐒𝐓𝐎𝐏  𝐁𝐎𝐓 - 2026*`;

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: menu.trim(),
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '❌ Error al generar la interfaz.', m);
  }
};

handler.command = ['menu', 'help', 'menú'];
export default handler;
