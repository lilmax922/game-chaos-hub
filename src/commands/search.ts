import type { LineBotClient } from '@line/bot-sdk'
import { formatTimestamp, getArticleUrl, search } from '../services/league-funny-api.js'
import tempTopic from '../templates/temp-topic.js'
import writeJson from '../utils/write-json.js'

interface Article {
  f_cover?: string
  preview?: { imageList?: string[] }
  f_desc?: string
  f_game_name?: string
  f_cat_name?: string
  f_dateline?: number
  content?: string
  f_game_type?: string
  fid?: string | number
}

function buildBubble(article: Article): typeof tempTopic {
  const bubble = JSON.parse(JSON.stringify(tempTopic))

  const coverImage = article.f_cover || article.preview?.imageList?.[0] || 'https://raw.githubusercontent.com/lilmax922/Photos/main/640px-Image_not_available.png'
  bubble.hero.url = coverImage

  ;(bubble.body.contents[0] as { text: string }).text = article.f_desc || '此篇無標題QQ'

  const categoryText = article.f_game_name && article.f_cat_name
    ? `${article.f_game_name} › ${article.f_cat_name}`
    : (article.f_cat_name || article.f_game_name || '搜尋結果')
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[0] as { contents: unknown[] }).contents[0] as { text: string }).text = categoryText

  const timeAgo = formatTimestamp(article.f_dateline || 0)
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[1] as { contents: unknown[] }).contents[0] as { text: string }).text = `${timeAgo} 發表在`

  const boardName = article.f_game_name || '未知看板'
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[1] as { contents: unknown[] }).contents[1] as { text: string }).text = boardName

  const description = article.content?.substring(0, 100) || article.f_desc || '此篇無簡介QQ'
  ;(((bubble.body.contents[2] as { contents: unknown[] }).contents[0] as { text: string })).text = description

  ;(((bubble.footer.contents[0] as { action: { uri: string } }).action)).uri = getArticleUrl(article.f_game_type || 'unknown', article.fid || 0)

  return bubble
}

interface SearchResult {
  data?: Article[]
  total?: number
}

export async function handleSearch(
  client: LineBotClient,
  replyToken: string,
  text: string,
): Promise<void> {
  try {
    const keyword = (text ?? '').trim()

    console.log(`[Command] handleSearch | input="${keyword}"`)

    if (keyword.length < 2) {
      await client.replyMessage({
        replyToken,
        messages: [{ type: 'text', text: '請輸入有效的搜尋關鍵字（至少2個字）' }],
      })
      return
    }

    const result = (await search(keyword)) as SearchResult

    const articles = result.data || []
    const total = result.total || 0

    if (articles.length === 0) {
      await client.replyMessage({
        replyToken,
        messages: [{ type: 'text', text: `找不到「${keyword}」相關文章` }],
      })
      return
    }

    const bubbles = []
    let count = 0
    for (const article of articles) {
      if (count >= 12)
        break
      try {
        bubbles.push(buildBubble(article))
        count++
      }
      catch (e) {
        console.error('Error building bubble:', e)
      }
    }

    const reply = {
      type: 'flex' as const,
      altText: `搜尋「${keyword}」找到 ${total} 篇文章`,
      contents: {
        type: 'carousel' as const,
        contents: bubbles,
      },
    }

    await client.replyMessage({
      replyToken,
      messages: [reply as any],
    })
    writeJson(reply, 'debug_search')
  }
  catch (error) {
    console.error('handleSearch error:', error)
    await client.replyMessage({
      replyToken,
      messages: [{ type: 'text', text: '搜尋失敗，請稍後再試' }],
    })
  }
}

export default handleSearch
