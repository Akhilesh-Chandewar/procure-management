import { Application, json, urlencoded, Request, Response, NextFunction } from 'express'
import Logger from 'bunyan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import compression from 'compression'
import { config } from './config/config'
import applicationRoutes from './routes/routes'
import HTTP_STATUS from 'http-status-codes'
import { ApiResponse } from './helpers/apiResponse'
import { CustomError, IErrorResponse } from './helpers/errorHandler'

const log: Logger = config.createLogger('server')
const SERVER_PORT = config.PORT

export class ProcureManagementServer {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.securityMiddlewares(this.app)
    this.standardMiddlewares(this.app)
    this.routesMiddlewares(this.app)
    this.routeNotFoundHandler(this.app)
    this.globalErrorHandler(this.app)
    this.startHttpServer(this.app)
  }

  private securityMiddlewares(app: Application): void {
    app.set('trust proxy', 1)
    app.use(cookieParser())
    app.use(hpp())
    app.use(helmet())
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
      })
    )
  }

  private standardMiddlewares(app: Application): void {
    app.use(json({ limit: '10kb' }))
    app.use(urlencoded({ extended: true, limit: '10kb' }))
    app.use(compression())
  }

  private routesMiddlewares(app: Application): void {
    applicationRoutes(app)
  }

  private routeNotFoundHandler(app: Application): void {
    app.use((req: Request, res: Response) => {
      console.log(">>>",req.url)
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(new ApiResponse(HTTP_STATUS.NOT_FOUND, 'Route not found', false))
    })
  }

  private globalErrorHandler(app: Application) {
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction): void => {
      log.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      } else {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Something went wrong' });
      }
      next();
    });
  }

  private startHttpServer(app: Application): void {
    log.info(`Worker with PID ${process.pid} starting…`)
    app.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`)
    })
  }
}
