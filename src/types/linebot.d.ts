declare module 'linebot' {
  export interface Config {
    channelId: string
    channelSecret: string
    channelAccessToken: string
  }

  export interface Message {
    type: string
    id: string
    text?: string
  }

  export interface Event {
    type: string
    message: Message
    reply: (message: unknown) => Promise<unknown>
  }

  export interface LineBot {
    on: (event: 'message', handler: (event: Event) => void | Promise<void>) => void
    parser: () => (req: unknown, res: unknown) => void
  }

  export interface LineBotStatic {
    (config: Config): LineBot
  }

  const linebot: LineBotStatic
  export default linebot
}
