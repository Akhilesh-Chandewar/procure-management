import dotenvFlow from 'dotenv-flow'
import bunyan, { Stream } from 'bunyan'
import { dim, green, red, yellow, cyan } from 'colorette'
import cloudinary from 'cloudinary'

dotenvFlow.config()

interface CustomLogRecord {
  time: Date
  level: number
  msg: string
  name: string
}

class Config {
  public NODE_ENV: string | undefined
  public PORT: number
  public DATABASE_URL: string | undefined
  public ACCESS_TOKEN_KEY: string | undefined
  public REFRESH_TOKEN_KEY: string | undefined
  public CLIENT_URL: string | undefined
  public SERVER_URL: string | undefined
  public CLOUDINARY_CLOUD_NAME: string | undefined
  public CLOUDINARY_API_KEY: string | undefined
  public CLOUDINARY_API_SECRET: string | undefined

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV
    this.PORT = Number(process.env.PORT) || 8080
    this.DATABASE_URL = process.env.DATABASE_URL
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY
    this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY
    this.CLIENT_URL = process.env.CLIENT_URL
    this.SERVER_URL = process.env.SERVER_URL
    this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
  }

  public createLogger(name: string): bunyan {
    const customStream: Stream = {
      level: 'debug',
      type: 'raw',
      stream: {
        write: (record: object): void => {
          if (this.isCustomLogRecord(record)) {
            const timestamp = dim(record.time.toISOString())
            const levelName =
              bunyan.nameFromLevel[record.level]?.toUpperCase() ?? 'UNKNOWN'
            const color = this.getColor(record.level)
            const output = `${timestamp} [${color(levelName)}] (${record.name}) ${record.msg}`
            // eslint-disable-next-line no-console
            console.log(output)
          }
        }
      }
    }

    return bunyan.createLogger({
      name,
      level: 'debug',
      streams: [customStream]
    })
  }

  private getColor(level: number): (text: string) => string {
    switch (level) {
      case bunyan.FATAL:
      case bunyan.ERROR:
        return red
      case bunyan.WARN:
        return yellow
      case bunyan.INFO:
        return green
      case bunyan.DEBUG:
        return cyan
      default:
        return (text: string): string => text
    }
  }

  private isCustomLogRecord(record: object): record is CustomLogRecord {
    return (
      typeof record === 'object' &&
      record !== null &&
      'time' in record &&
      'level' in record &&
      'msg' in record &&
      'name' in record
    )
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`)
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_CLOUD_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    })
  }
}

export const config: Config = new Config()
