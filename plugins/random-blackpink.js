import fetch from 'node-fetch'
let handler = async(m, { conn, args, usedPrefix, command }) => {
fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt').then(res => res.text()).then(body => {
let randomkpop = body.split('\n')
let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
//conn.sendFile(m.chat, randomkpopx, 'error.jpg', `_${command}_`, m)
conn.sendButton(m.chat, `_${command}_`, wm, randomkpopx, [['التالي | 🆕', `/${command}`]], null, null, m)
})}
handler.help = ['عشوائي']
handler.tags = ['internet']
handler.command = /^(عشوائي)$/i
export default handler
