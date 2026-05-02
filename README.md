# 遊戲大亂源 LINE Bot

一個基於 LINE Messaging API 的遊戲社群文章機器人，為您提供來自 league-funny.com 的熱門遊戲、新聞、休閒娛樂內容。

Line ID: @368uzwcl

## 功能特色

- 瀏覽熱門/最新文章
- 支援 12 個精選看板（遊戲、生活分類）
- 關鍵字搜尋文章
- Quick Reply 快速選單，操作直覺
- Flex Message 輪播介面

## 使用方式

### 方式一：輸入指令

| 指令 | 說明 |
|------|------|
| `熱門文章` / `最新文章` | 顯示看板選擇選單 |
| `!熱門` / `!hot` | 熱門文章 |
| `!最新` / `!new` | 最新文章 |
| `!熱門 看板名` | 指定看板熱門文章 |
| `!最新 看板名` | 指定看板最新文章 |
| 任意文字 | 搜尋關鍵字 |

> 請注意：`!` 和 空格皆為半形

### 方式二：點擊圖文選單

選擇「熱門文章」或「最新文章」後，點擊 Quick Reply 小按鈕選擇想要的看板。

## 支援看板

### 遊戲類

英雄聯盟、爐石戰記、寶可夢、Apex 英雄、綜合遊戲、聯盟戰棋

### 生活類

八卦新聞、休閒娛樂、正妹、電影、動漫、迷因

## 技術棧

- **語言**: TypeScript
- **框架**: Express.js
- **LINE SDK**: @line/bot-sdk
- **爬蟲**: cloudscraper
- **套件管理**: pnpm

## 快速開始

### 安裝依賴

```bash
pnpm install
```

### 環境變數設定

複製 `.env.example` 為 `.env`，並填入以下變數：

```env
CHANNEL_ACCESS_TOKEN=你的 LINE Channel Access Token
CHANNEL_SECRET=你的 LINE Channel Secret
PORT=3000
```

### 執行

```bash
# 開發模式
pnpm dev

# 正式環境
pnpm build
pnpm start
```

## 部署

本專案支援 Render 部署，請參考 `render.yaml` 進行設定。

## 資料來源

[league-funny.com](https://www.league-funny.com/)