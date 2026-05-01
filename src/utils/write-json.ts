import fs from 'node:fs'

function writeJson(json: unknown, filename: string): void {
  if (process.env.WRITEJSON !== 'true')
    return

  if (!fs.existsSync('./debug'))
    fs.mkdirSync('./debug')

  fs.writeFileSync(`./debug/${filename}.json`, JSON.stringify(json, null, 2))
}

export default writeJson
