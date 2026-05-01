const createQuickReply = (prefix) => ({
  type: 'text',
  text: '選擇喜歡的看板吧!',
  quickReply: {
    items: [
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/fire.png',
        action: {
          type: 'message',
          label: '全部',
          text: `${prefix} 全部`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/256px-LoL_icon.png',
        action: {
          type: 'message',
          label: '英雄聯盟',
          text: `${prefix} 英雄聯盟`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/gossip.png',
        action: {
          type: 'message',
          label: '八卦新聞',
          text: `${prefix} 八卦`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/funny.png',
        action: {
          type: 'message',
          label: '休閒娛樂',
          text: `${prefix} 娛樂`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/hearthstone.png',
        action: {
          type: 'message',
          label: '爐石戰記',
          text: `${prefix} 爐石戰記`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/psyduck.png',
        action: {
          type: 'message',
          label: '寶可夢',
          text: `${prefix} 寶可夢`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/apex.png',
        action: {
          type: 'message',
          label: 'Apex英雄',
          text: `${prefix} apex英雄`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/games.png',
        action: {
          type: 'message',
          label: '綜合遊戲',
          text: `${prefix} 遊戲`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/pets.png',
        action: {
          type: 'message',
          label: '寵物',
          text: `${prefix} 寵物`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/animation.png',
        action: {
          type: 'message',
          label: '動漫',
          text: `${prefix} 動漫`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/movie.png',
        action: {
          type: 'message',
          label: '電影',
          text: `${prefix} 電影`
        }
      },
      {
        type: 'action',
        imageUrl: 'https://raw.githubusercontent.com/lilmax922/Photos/main/icons/meme.png',
        action: {
          type: 'message',
          label: '迷因',
          text: `${prefix} 迷因`
        }
      }
    ]
  }
})

export const quickReplyHot = createQuickReply('!熱門')
export const quickReplyNew = createQuickReply('!最新')

export default { quickReplyHot, quickReplyNew }