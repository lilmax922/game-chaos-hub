import express from 'express';
import linebot from 'linebot';
import { handleArticle } from './commands/article.js';
import { handleSearch } from './commands/search.js';
import { quickReplyHot, quickReplyNew } from './quick-reply/quick-reply.js';
import 'dotenv/config';
const app = express();
const bot = linebot({
    channelId: process.env.CHANNEL_ID ?? '',
    channelSecret: process.env.CHANNEL_SECRET ?? '',
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? '',
});
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
]);
bot.on('message', async (event) => {
    const text = event.message.text ?? '';
    if (text === '熱門文章') {
        await event.reply(quickReplyHot);
        return;
    }
    if (text === '最新文章') {
        await event.reply(quickReplyNew);
        return;
    }
    const lowerText = text.toLowerCase().trim();
    if (lowerText === '全部') {
        await handleArticle(event);
        return;
    }
    if (BOARD_NAMES.has(text)) {
        await handleArticle(event);
        return;
    }
    if (lowerText === '!熱門' || lowerText === '!hot') {
        await handleArticle(event);
        return;
    }
    if (lowerText === '!最新' || lowerText === '!new') {
        await handleArticle(event);
        return;
    }
    if (lowerText.startsWith('!熱門 ') || lowerText.startsWith('!hot ')) {
        await handleArticle(event);
        return;
    }
    if (lowerText.startsWith('!最新 ') || lowerText.startsWith('!new ')) {
        await handleArticle(event);
        return;
    }
    await handleSearch(event);
});
const linebotParser = bot.parser();
app.post('/', linebotParser);
app.get('/', (_request, response) => {
    response.status(200).send('ok');
});
app.listen(process.env.PORT || 3000, () => {
    console.log('機器人啟動');
});
