import express, { Express } from 'express'
import { ProcureManagementServer } from './serverSetup'
import { config } from './config/config'
import connectDB from './database/database'
import Logger from 'bunyan'

const log: Logger = config.createLogger('server')

class Application {
  public async initialize(): Promise<void> {
    config.validateConfig()
    await connectDB()
    const app: Express = express()
    const server: ProcureManagementServer = new ProcureManagementServer(app)
    server.start()
    Application.handleExit()
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error({ error }, 'Uncaught Exception')
      Application.shutDownProperly(1)
    })

    process.on('unhandledRejection', (reason: unknown) => {
      log.error({ reason }, 'Unhandled Rejection')
      Application.shutDownProperly(1)
    })

    process.on('SIGTERM', () => {
      log.warn('Caught SIGTERM')
      Application.shutDownProperly(0)
    })

    process.on('SIGINT', () => {
      log.warn('Caught SIGINT')
      Application.shutDownProperly(0)
    })

    process.on('exit', (code) => {
      log.info({ code }, 'Process exiting')
    })
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutdown complete')
        process.exit(exitCode)
      })
      .catch((error: Error) => {
        log.error({ error }, 'Error during shutdown')
        process.exit(1)
      })
  }
}

const application = new Application()

application.initialize().catch((err: Error) => {
  log.fatal({ err }, 'Fatal error during application bootstrap')
  process.exit(1)
})
