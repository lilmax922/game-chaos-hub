import 'dotenv/config'
import linebot from 'linebot'
import express from 'express'
import handleArticle from './src/commands/article.js'
import handleSearch from './src/commands/search.js'
import { quickReplyHot, quickReplyNew } from './src/quick_reply/quick_reply.js'

const app = express()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const BOARD_NAMES = new Set([
  'lol', 'gaming', 'apexleagues', 'pokemon', 'overwatch', 'steam', 'TFT',
  'yugioh', 'hs', 'lolm', 'valorant', 'moba', 'gta', 'PUBG', 'csgo',
  'mobileGame', 'hotchick', 'gossiping', 'funny', 'movie', 'pet',
  'acg', '3c', 'sport', 'meme',
  '英雄聯盟', '遊戲', 'apex英雄', '寶可夢', '鬥陣特工', 'steam',
  '聯盟戰旗', '遊戲王', '爐石戰記', '激鬥峽谷', '特戰英豪', '傳說對決',
  '俠盜獵車手', '絕地求生', 'csgo', '手遊', '福利', '八卦', '娛樂',
  '電影', '寵物', '動漫', '3c', '運動', '迷因'
])

bot.on('message', event => {
  const text = event.message.text

  if (text === '熱門文章') {
    event.reply(quickReplyHot)
    return
  }
  if (text === '最新文章') {
    event.reply(quickReplyNew)
    return
  }

  const lowerText = text.toLowerCase().trim()

  if (lowerText === '全部') {
    handleArticle(event)
    return
  }

  if (BOARD_NAMES.has(text)) {
    handleArticle(event)
    return
  }

  if (lowerText === '!熱門' || lowerText === '!hot') {
    handleArticle(event)
    return
  }
  if (lowerText === '!最新' || lowerText === '!new') {
    handleArticle(event)
    return
  }

  if (lowerText.startsWith('!熱門 ') || lowerText.startsWith('!hot ')) {
    handleArticle(event)
    return
  }
  if (lowerText.startsWith('!最新 ') || lowerText.startsWith('!new ')) {
    handleArticle(event)
    return
  }

  handleSearch(event)
})

const linebotParser = bot.parser()

app.post('/', linebotParser)

app.get('/', (request, response) => {
  response.status(200).send('ok')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})