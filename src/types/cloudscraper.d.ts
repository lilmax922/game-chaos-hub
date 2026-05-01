declare module 'cloudscraper' {
  interface Cloudscraper {
    get: (url: string) => Promise<string>
    post: (url: string, body?: unknown) => Promise<string>
  }

  const cloudscraper: Cloudscraper
  export default cloudscraper
}
