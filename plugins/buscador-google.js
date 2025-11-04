import axios from 'axios'

// --- Configuración ---
const BASE_API_URL = 'https://api.vreden.my.id/api/v1/search/google'
const DEFAULT_MAX = 10
const HARD_MAX = 30 // Límite máximo para evitar sobrecargar la API
const API_TIMEOUT = 15000 // 15 segundos
const MAX_SNIPPET_LENGTH = 180

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

/**
 * Realiza una búsqueda de Google utilizando la API externa.
 * @param {string} query El término de búsqueda.
 * @param {number} count El número de resultados a solicitar (máximo 30).
 * @returns {Promise<Array<{idx: number, title: string, link: string, snippet: string}>>}
 */
async function apiSearch (query, count = DEFAULT_MAX) {
  const targetCount = Math.min(count, HARD_MAX)

  try {
    const params = {
      query: query,
      count: targetCount
    }

    const { data: response } = await axios.get(BASE_API_URL, {
      params: params,
      timeout: API_TIMEOUT,
      headers: {
        'Accept': 'application/json'
      }
    })

    // Asegurarse de que la respuesta tenga un formato esperado y éxito
    if (response && response.status === true && Array.isArray(response.data)) {
      // Mapear los resultados al formato deseado (title, link, snippet)
      const results = response.data
        .slice(0, targetCount) // Asegurar que no excedemos el límite
        .map((item, index) => ({
          idx: index + 1,
          title: item.title || 'Sin título',
          link: item.link || item.url || '', // Acepta link o url
          snippet: item.snippet || ''
        }))
        .filter(r => r.link) // Filtra resultados sin link válido
        
      return results
    } else {
      // Si la API responde pero el estado no es exitoso o no hay datos
      console.error('[apisearch] Respuesta de API no exitosa o sin datos:', response)
      return []
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
        console.error(`[apisearch] Error de red o timeout al llamar a la API: ${e.message}`)
    } else {
        console.error('[apisearch] Error inesperado en la búsqueda:', e)
    }
    return []
  }
}

// Mensaje de contacto simulado (estilo otros plugins)
const fkontak = {
  key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'ApiSearch' },
  message: { contactMessage: { displayName: 'API Web Search', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;API Web Search;;;\nFN:API Web Search\nORG:Buscador API Vreden\nEND:VCARD' } }
}

/**
 * Función principal (handler) para el comando del bot.
 * @param {object} m Objeto de mensaje.
 * @param {object} param1 Objeto de utilidades (conn, text, usedPrefix, command).
 */
const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Simulación de contexto de bot
  const ctx = (typeof global.rcanalr === 'object') ? global.rcanalr : ((typeof global.rcanal === 'object') ? global.rcanal : {})

  if (!text) return conn.reply(m.chat, `*[❗] Ingrese una consulta de búsqueda.*\n\nEjemplos:\n${usedPrefix + command} javascript promise\n${usedPrefix + command} inteligencia artificial all`, m, ctx)
  
  const parts = text.trim().split(/\s+/)
  let last = parts[parts.length - 1]?.toLowerCase()
  let requested
  
  // Extraer el número de resultados solicitado o 'all'
  if (/^\d+$/.test(last)) { requested = parseInt(last, 10); parts.pop() } 
  else if (['all', 'todo', 'todos'].includes(last)) { requested = HARD_MAX; parts.pop() } 
  else { requested = DEFAULT_MAX }
  
  if (requested <= 0) requested = DEFAULT_MAX
  if (requested > HARD_MAX) requested = HARD_MAX
  
  const query = parts.join(' ').trim()
  if (!query) return conn.reply(m.chat, '❗ Búsqueda vacía.', m, ctx)
  
  let status
  try {
    status = await conn.reply(m.chat, `🔍 *Buscando en API:* ${query}\nLímite: ${requested}\nPor favor espere...`, m, ctx)
    
    // Llama a la nueva función de búsqueda
    const results = await apiSearch(query, requested)

    if (!results.length) return conn.reply(m.chat, '❌ No se hallaron resultados útiles a través de la API.', m, { quoted: fkontak, ...ctx })
    
    // Formatear resultados
    const lines = results.map(r => 
      `*${r.idx}.* ${r.title}\n${r.link}${r.snippet ? `\n_${r.snippet.slice(0, MAX_SNIPPET_LENGTH)}_` : ''}`
    )
    
    const header = `✅ *Resultados (${results.length})*\n*Término:* ${query}\n`;
    const body = header + '\n' + lines.join('\n\n')
    
    // Enviar el resultado (manejo de mensajes largos)
    if (body.length > 4000) {
      await conn.reply(m.chat, `⚠️ El mensaje es muy largo. Enviando en partes...`, m, ctx)
      const chunks = []
      let tmp = body
      while (tmp.length) {
        chunks.push(tmp.slice(0, 3500))
        tmp = tmp.slice(3500)
      }
      for (let i = 0; i < chunks.length; i++) {
        await conn.reply(m.chat, chunks[i] + `\n_[parte ${i + 1}/${chunks.length}]_`, m, { quoted: fkontak, ...ctx })
        await sleep(400)
      }
    } else {
      await conn.reply(m.chat, body, m, { quoted: fkontak, ...ctx })
    }
  } catch (e) {
    console.error('[apisearch] Error en el handler:', e)
    return conn.reply(m.chat, `❌ Error en el proceso de búsqueda: ${e.message || e}`, m, ctx)
  } finally {
    // Intenta borrar el mensaje de estado de "Buscando..."
    if (status && typeof status.key === 'object' && status.key.id && status.key.remoteJid) { 
        try { 
            await conn.sendMessage(m.chat, { delete: status.key }) 
        } catch (e) {
            console.error('[apisearch] Error al intentar borrar el mensaje de estado:', e.message)
        } 
    }
  }
}

handler.help = ['apisearch <consulta> [n | all]']
handler.tags = ['internet', 'tools', 'busqueda']
handler.command = /^(apisearch|vreden|vsearch)$/i

export default handler
