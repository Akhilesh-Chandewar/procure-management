import mongoose, { ConnectOptions } from 'mongoose'
import Logger from 'bunyan'
import { config } from '../config/config'

const log: Logger = config.createLogger('database')

const MAX_RETRIES = 3
const RETRY_INTERVAL = 5_000

export interface ConnectionStatus {
  isConnected: boolean
  readyState: mongoose.Connection['readyState']
  host?: string
  name?: string
}

class DatabaseConnection {
  private retryCount = 0
  private isConnected = false
  public connect: () => Promise<void> = async () => {
    try {
      const uri = config.DATABASE_URL
      if (!uri) throw new Error('MongoDB URI is not defined in configuration')

      const options: ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 45_000,
        family: 4
      }

      if (process.env.NODE_ENV === 'development') mongoose.set('debug', true)
      await mongoose.connect(uri, options)
      this.retryCount = 0
    } catch (error: unknown) {
      log.error({ error }, 'Failed to connect to MongoDB')
      await this.handleConnectionError()
    }
  }

  public getConnectionStatus: () => ConnectionStatus = () => ({
    isConnected: this.isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  })

  private handleConnectionError: () => Promise<void> = async () => {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount += 1
      log.info(
        `Retrying connection... attempt ${this.retryCount}/${MAX_RETRIES}`
      )
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL))
      return this.connect()
    }
    log.fatal(
      `Unable to connect to MongoDB after ${MAX_RETRIES} attempts; exiting`
    )
    process.exit(1)
  }

  private handleDisconnection: () => void = () => {
    if (!this.isConnected) {
      log.info('Attempting to reconnect to MongoDB...')
      void this.connect()
    }
  }

  private handleAppTermination: () => Promise<void> = async () => {
    try {
      await mongoose.connection.close()
      log.info('MongoDB connection closed (app termination)')
      process.exit(0)
    } catch (err) {
      log.error({ err }, 'Error during database disconnection')
      process.exit(1)
    }
  }

  constructor() {
    mongoose.set('strictQuery', true)

    mongoose.connection.on('connected', () => {
      log.info('MongoDB connected successfully')
      this.isConnected = true
    })

    mongoose.connection.on('error', (err: Error) => {
      log.error({ err }, 'MongoDB connection error')
      this.isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      log.warn('MongoDB disconnected')
      this.isConnected = false
      this.handleDisconnection()
    })

    process.on('SIGINT', this.handleAppTermination)
    process.on('SIGTERM', this.handleAppTermination)
  }
}

const dbConnection = new DatabaseConnection()

export const connectDB = dbConnection.connect
export const getDBStatus = dbConnection.getConnectionStatus

export default connectDB
