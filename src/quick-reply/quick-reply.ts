interface QuickReplyAction {
  type: 'message'
  label: string
  text: string
}

interface QuickReplyItem {
  type: 'action'
  imageUrl?: string
  action: QuickReplyAction
}

interface QuickReplyPayload {
  type: 'text'
  text: string
  quickReply: {
    items: QuickReplyItem[]
  }
}

const BOARD_ICONS: Record<string, string> = {
  全部: '',
  英雄聯盟: 'https://img.league-funny.com/board_icon/1_sm.jpg',
  八卦新聞: 'https://img.league-funny.com/board_icon/8_sm.jpg',
  休閒娛樂: 'https://img.league-funny.com/board_icon/28_sm.jpg',
  爐石戰記: 'https://img.league-funny.com/board_icon/3_sm.jpg',
  寶可夢: 'https://img.league-funny.com/board_icon/6_sm.jpg',
  Apex英雄: 'https://img.league-funny.com/board_icon/34_sm.jpg',
  綜合遊戲: 'https://img.league-funny.com/board_icon/2_sm.jpg',
  聯盟戰棋: 'https://img.league-funny.com/board_icon/38_sm.jpg',
  正妹: 'https://img.league-funny.com/board_icon/25_sm.jpg',
  動漫: 'https://img.league-funny.com/board_icon/39_sm.jpg',
  電影: 'https://img.league-funny.com/board_icon/29_sm.jpg',
  迷因: 'https://img.league-funny.com/board_icon/46_sm.jpg',
}

function createQuickReplyItem(label: string, text: string): QuickReplyItem {
  const imageUrl = BOARD_ICONS[label]
  return {
    type: 'action',
    imageUrl: imageUrl || undefined,
    action: {
      type: 'message',
      label,
      text,
    },
  }
}

function createQuickReply(prefix: string): QuickReplyPayload {
  const items: QuickReplyItem[] = [
    createQuickReplyItem('全部', `${prefix} 全部`),
    createQuickReplyItem('英雄聯盟', `${prefix} 英雄聯盟`),
    createQuickReplyItem('八卦新聞', `${prefix} 八卦`),
    createQuickReplyItem('休閒娛樂', `${prefix} 娛樂`),
    createQuickReplyItem('爐石戰記', `${prefix} 爐石戰記`),
    createQuickReplyItem('寶可夢', `${prefix} 寶可夢`),
    createQuickReplyItem('Apex英雄', `${prefix} apex英雄`),
    createQuickReplyItem('綜合遊戲', `${prefix} 遊戲`),
    createQuickReplyItem('聯盟戰棋', `${prefix} 聯盟戰棋`),
    createQuickReplyItem('正妹', `${prefix} 正妹`),
    createQuickReplyItem('動漫', `${prefix} 動漫`),
    createQuickReplyItem('電影', `${prefix} 電影`),
    createQuickReplyItem('迷因', `${prefix} 迷因`),
  ]

  return {
    type: 'text',
    text: '選擇喜歡的看板吧!',
    quickReply: {
      items,
    },
  }
}

export const quickReplyHot = createQuickReply('!熱門')
export const quickReplyNew = createQuickReply('!最新')
