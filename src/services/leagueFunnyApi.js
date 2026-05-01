import cloudscraper from 'cloudscraper'

const BASE_URL = 'https://www.league-funny.com/service/api'

const boardCache = {
  data: null,
  timestamp: 0,
  ttl: 60 * 60 * 1000
}

async function apiGet (path, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const url = queryString
    ? `${BASE_URL}${path}?${queryString}`
    : `${BASE_URL}${path}`

  const response = await cloudscraper.get(url)
  return JSON.parse(response)
}

export async function fetchBoards () {
  const now = Date.now()
  if (boardCache.data && (now - boardCache.timestamp) < boardCache.ttl) {
    return boardCache.data
  }

  try {
    const response = await apiGet('/board')
    if (response.status === 'success') {
      boardCache.data = response.data
      boardCache.timestamp = now
      return boardCache.data
    }
    throw new Error(response.message || 'Failed to fetch boards')
  } catch (error) {
    console.error('fetchBoards error:', error.message)
    throw error
  }
}

export async function fetchFeed (board, sort = 'hot', page = 1) {
  try {
    console.log(`[API] fetchFeed | board=${board} sort=${sort} page=${page}`)
    const params = { sort, page: String(page) }
    if (board) params.board = board
    const response = await apiGet('/feed', params)
    console.log(`[API] fetchFeed success | board=${board} sort=${sort} | items=${Array.isArray(response.data) ? response.data.length : 'N/A'}`)
    if (response.status === 'success') {
      return response.data
    }
    throw new Error(response.message || 'Failed to fetch feed')
  } catch (error) {
    console.error(`[API] fetchFeed error | board=${board} sort=${sort} |`, error.message)
    throw error
  }
}

export async function search (keyword, page = 1) {
  try {
    console.log(`[API] search | keyword=${keyword} page=${page}`)
    const response = await apiGet('/search', { s: keyword, page: String(page) })
    const total = response.data?.total || 0
    const count = response.data?.data?.length || 0
    console.log(`[API] search success | keyword=${keyword} | total=${total} returned=${count}`)
    if (response.status === 'success') {
      return response.data
    }
    throw new Error(response.message || 'Search failed')
  } catch (error) {
    console.error(`[API] search error | keyword=${keyword} |`, error.message)
    throw error
  }
}

export function getArticleUrl (board, fid) {
  return `https://www.league-funny.com/${board}/article/${fid}`
}

export function formatTimestamp (timestamp) {
  const now = Date.now() / 1000
  const diff = now - timestamp

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小時前`
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`

  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
