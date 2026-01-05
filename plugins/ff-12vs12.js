import fs from 'fs'
import path from 'path'

let handlerLista = async (m, { conn }) => {
  const listaPath = path.join('./database/lista12vs12.json')

  // Si no existe, lo creamos vacío
  if (!fs.existsSync(listaPath)) {
    const inicial = { titulares: [], suplentes: [] }
    fs.writeFileSync(listaPath, JSON.stringify(inicial, null, 2))
  }

  const lista = JSON.parse(fs.readFileSync(listaPath, 'utf-8'))

  let texto = `╭─❍ *📋 LISTA 12 VS 12*\n│\n│❤️ *Titulares:*\n`
  if (lista.titulares.length === 0) {
    texto += `│ (vacío)\n`
  } else {
    lista.titulares.forEach((j, i) => {
      texto += `│ ${i+1}. ${j}\n`
    })
  }

  texto += `│\n│👍 *Suplentes:*\n`
  if (lista.suplentes.length === 0) {
    texto += `│ (vacío)\n`
  } else {
    lista.suplentes.forEach((j, i) => {
      texto += `│ ${i+1}. ${j}\n`
    })
  }

  texto += `╰────────────────────❍`

  await conn.sendMessage(m.chat, { text: texto })
}

handlerLista.help = ['lista12vs12']
handlerLista.tags = ['freefire']
handlerLista.command = /^(1)$/i
handlerLista.group = true

export default handlerLista