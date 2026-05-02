import type { Request, Response } from 'express'
import * as line from '@line/bot-sdk'
import express from 'express'
import { handleArticle } from './commands/article.js'
import { handleSearch } from './commands/search.js'
import { quickReplyHot, quickReplyNew } from './quick-reply/quick-reply.js'
import 'dotenv/config'

const app = express()

const client = line.LineBotClient.fromChannelAccessToken({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? '',
})

const lineMiddleware = line.middleware({
  channelSecret: process.env.CHANNEL_SECRET ?? '',
})

const BOARD_NAMES = new Set([
  'lol',
  'gaming',
  'apexleagues',
  'pokemon',
  'overwatch',
  'steam',
  'TFT',
  'yugioh',
  'hs',
  'lolm',
  'valorant',
  'moba',
  'gta',
  'PUBG',
  'csgo',
  'mobileGame',
  'hotchick',
  'gossiping',
  'funny',
  'movie',
  'pet',
  'acg',
  '3c',
  'sport',
  'meme',
  '英雄聯盟',
  '遊戲',
  'apex英雄',
  '寶可夢',
  '鬥陣特工',
  'steam',
  '聯盟戰旗',
  '遊戲王',
  '爐石戰記',
  '激鬥峽谷',
  '特戰英豪',
  '傳說對決',
  '俠盜獵車手',
  '絕地求生',
  'csgo',
  '手遊',
  '福利',
  '八卦',
  '娛樂',
  '電影',
  '寵物',
  '動漫',
  '3c',
  '運動',
  '迷因',
])

type WebhookEvent = line.webhook.Event

async function processEvent(event: WebhookEvent): Promise<void> {
  if (event.type === 'message') {
    const msgEvent = event as line.webhook.MessageEvent
    if (msgEvent.message.type === 'text') {
      await handleTextMessage(msgEvent)
    }
  }
  else if (event.type === 'postback') {
    const postbackEvent = event as line.webhook.PostbackEvent
    await handlePostback(postbackEvent)
  }
}

async function handleTextMessage(event: line.webhook.MessageEvent): Promise<void> {
  const message = event.message
  const text = message.type === 'text' ? message.text : ''

  if (text === '熱門文章') {
    await client.replyMessage({
      replyToken: event.replyToken!,
      messages: [quickReplyHot],
    })
    return
  }
  if (text === '最新文章') {
    await client.replyMessage({
      replyToken: event.replyToken!,
      messages: [quickReplyNew],
    })
    return
  }

  const lowerText = text.toLowerCase().trim()

  if (lowerText === '全部') {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (BOARD_NAMES.has(text)) {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (lowerText === '!熱門' || lowerText === '!hot') {
    await handleArticle(client, event.replyToken!, text)
    return
  }
  if (lowerText === '!最新' || lowerText === '!new') {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (lowerText.startsWith('!熱門 ') || lowerText.startsWith('!hot ')) {
    await handleArticle(client, event.replyToken!, text)
    return
  }
  if (lowerText.startsWith('!最新 ') || lowerText.startsWith('!new ')) {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  await handleSearch(client, event.replyToken!, text)
}

async function handlePostback(event: line.webhook.PostbackEvent): Promise<void> {
  const data = event.postback.data

  if (data === '熱門文章') {
    await client.replyMessage({
      replyToken: event.replyToken!,
      messages: [quickReplyHot],
    })
    return
  }
  if (data === '最新文章') {
    await client.replyMessage({
      replyToken: event.replyToken!,
      messages: [quickReplyNew],
    })
    return
  }

  const text = data ?? ''
  const lowerText = text.toLowerCase().trim()

  if (lowerText === '全部') {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (BOARD_NAMES.has(text)) {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (lowerText === '!熱門' || lowerText === '!hot') {
    await handleArticle(client, event.replyToken!, text)
    return
  }
  if (lowerText === '!最新' || lowerText === '!new') {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  if (lowerText.startsWith('!熱門 ') || lowerText.startsWith('!hot ')) {
    await handleArticle(client, event.replyToken!, text)
    return
  }
  if (lowerText.startsWith('!最新 ') || lowerText.startsWith('!new ')) {
    await handleArticle(client, event.replyToken!, text)
    return
  }

  await handleSearch(client, event.replyToken!, text)
}

app.post('/', lineMiddleware, async (req: Request, res: Response) => {
  const events = req.body.events as WebhookEvent[] | undefined
  if (!events || events.length === 0) {
    res.status(200).send('ok')
    return
  }

  try {
    await Promise.all(events.map(processEvent))
    res.status(200).json({ success: true })
  }
  catch (err) {
    console.error('Error handling events:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/', (_request: Request, response: Response) => {
  response.status(200).send('ok')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})