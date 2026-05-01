import { fetchFeed, formatTimestamp, getArticleUrl } from '../services/league-funny-api.js'
import tempTopic from '../templates/temp-topic.js'
import writeJson from '../utils/write-json.js'

interface BoardInfo {
  chi: string
  eng: string
}

type BoardType = string

const BOARD_MAP: Record<BoardType, BoardInfo> = {
  'lol': { chi: '英雄聯盟', eng: 'lol' },
  'gaming': { chi: '遊戲', eng: 'gaming' },
  'apexleagues': { chi: 'apex英雄', eng: 'apex' },
  'pokemon': { chi: '寶可夢', eng: 'pokemon' },
  'overwatch': { chi: '鬥陣特工', eng: 'overwatch' },
  'steam': { chi: 'steam', eng: 'steam' },
  'TFT': { chi: '聯盟戰旗', eng: 'tft' },
  'yugioh': { chi: '遊戲王', eng: 'yugioh' },
  'hs': { chi: '爐石戰記', eng: 'hs' },
  'lolm': { chi: '激鬥峽谷', eng: 'lolm' },
  'valorant': { chi: '特戰英豪', eng: 'valorant' },
  'moba': { chi: '傳說對決', eng: 'aov' },
  'gta': { chi: '俠盜獵車手', eng: 'gta' },
  'PUBG': { chi: '絕地求生', eng: 'pubg' },
  'csgo': { chi: 'csgo', eng: 'csgo' },
  'mobileGame': { chi: '手遊', eng: 'mobilegame' },
  'hotchick': { chi: '福利', eng: 'hso' },
  'gossiping': { chi: '八卦', eng: 'gossiping' },
  'funny': { chi: '娛樂', eng: 'funny' },
  'movie': { chi: '電影', eng: 'movie' },
  'pet': { chi: '寵物', eng: 'pet' },
  'acg': { chi: '動漫', eng: 'acg' },
  '3c': { chi: '3c', eng: '3c' },
  'sport': { chi: '運動', eng: 'sport' },
  'meme': { chi: '迷因', eng: 'meme' },
}

function findBoard(keyword: string): BoardType | null {
  if (!keyword)
    return null

  const lowerKeyword = keyword.toLowerCase()

  for (const [bType, info] of Object.entries(BOARD_MAP)) {
    if (info.chi === keyword || info.eng.toLowerCase() === lowerKeyword || bType.toLowerCase() === lowerKeyword)
      return bType
  }
  return null
}

interface ParsedCommand {
  board: BoardType | null
  sort: 'hot' | 'new'
}

function parseCommand(text: string): ParsedCommand | null {
  const lowerText = text.toLowerCase().trim()

  if (lowerText === '全部')
    return { board: null, sort: 'hot' }

  const combinedMatch = text.match(/^!(熱門|最新|hot|new)\s+(.+)$/i)
  if (combinedMatch) {
    const sortWord = combinedMatch[1]
    const boardKeyword = combinedMatch[2]
    const sort = (sortWord === '最新' || sortWord.toLowerCase() === 'new') ? 'new' : 'hot'
    const board = findBoard(boardKeyword)
    return { board, sort }
  }

  const boardMatch = findBoard(text)
  if (boardMatch)
    return { board: boardMatch, sort: 'hot' }

  if (lowerText === '熱門' || lowerText === 'hot')
    return { board: null, sort: 'hot' }
  if (lowerText === '最新' || lowerText === 'new')
    return { board: null, sort: 'new' }

  if (lowerText === '!熱門' || lowerText === '!hot')
    return { board: null, sort: 'hot' }
  if (lowerText === '!最新' || lowerText === '!new')
    return { board: null, sort: 'new' }

  return null
}

interface Article {
  f_type?: string
  preview?: { lotto_draw?: unknown }
  f_cover?: string
  f_desc?: string
  f_game_name?: string
  f_cat_name?: string
  f_dateline?: number
  content?: string
  f_game_type?: string
  fid?: string | number
  type?: string
}

function isLottoArticle(article: Article): boolean {
  return article.f_type === 'lotto_draw' || article.preview?.lotto_draw != null
}

function buildBubble(article: Article, board: BoardType | null): typeof tempTopic {
  const bubble = JSON.parse(JSON.stringify(tempTopic))

  bubble.hero.url = article.f_cover || 'https://raw.githubusercontent.com/lilmax922/Photos/main/640px-Image_not_available.png'
  ;(bubble.body.contents[0] as { text: string }).text = article.f_desc || '此篇無標題QQ'

  const categoryText = article.f_game_name && article.f_cat_name
    ? `${article.f_game_name} › ${article.f_cat_name}`
    : (article.f_cat_name || article.f_game_name || '此篇無分類QQ')
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[0] as { contents: unknown[] }).contents[0] as { text: string }).text = categoryText

  const timeAgo = formatTimestamp(article.f_dateline || 0)
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[1] as { contents: unknown[] }).contents[0] as { text: string }).text = `${timeAgo} 發表在`

  const boardName = board ? (BOARD_MAP[board]?.chi || board) : (article.f_game_name || '全站')
  ;(((bubble.body.contents[1] as { contents: unknown[] }).contents[1] as { contents: unknown[] }).contents[1] as { text: string }).text = boardName

  const description = article.content?.substring(0, 100) || article.f_desc || '此篇無簡介QQ'
  ;(((bubble.body.contents[2] as { contents: unknown[] }).contents[0] as { text: string })).text = description

  ;(((bubble.footer.contents[0] as { action: { uri: string } }).action)).uri = getArticleUrl(board || article.f_game_type || 'unknown', article.fid || 0)

  return bubble
}

interface LineEvent {
  message: { text?: string }
  reply: (message: unknown) => Promise<unknown>
}

export async function handleArticle(event: LineEvent): Promise<void> {
  try {
    const text = event.message.text ?? ''
    const parsed = parseCommand(text)
    if (!parsed)
      return

    const { board, sort } = parsed

    console.log(`[Command] handleArticle | input="${text}" | board=${board} sort=${sort}`)

    const articles = (await fetchFeed(board, sort)) as Article[]

    const bubbles = []
    let count = 0
    for (const article of articles) {
      if (count >= 12)
        break
      if (article.type === 'ad' || article.type === 'lotto' || article.type === 'kuji')
        continue
      if (isLottoArticle(article))
        continue

      try {
        bubbles.push(buildBubble(article, board))
        count++
      }
      catch (e) {
        console.error('Error building bubble:', e)
      }
    }

    const reply = {
      type: 'flex',
      altText: '遊戲圈時事文章',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    }

    if (bubbles.length === 0) {
      await event.reply('查無此類型文章')
    }
    else {
      await event.reply(reply)
      writeJson(reply, 'debug_articles')
    }
  }
  catch (error) {
    console.error('handleArticle error:', error)
    await event.reply('取得文章失敗，請稍後再試')
  }
}

export default handleArticle
