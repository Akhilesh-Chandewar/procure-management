import express, { Router, Request, Response } from 'express'
import moment from 'moment'
import HTTP_STATUS from 'http-status-codes'
import { config } from '../../config/config'
import { getDBStatus } from '../../database/database'
import { ApiResponse } from '../../helpers/apiResponse'

class HealthRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public health(): Router {
    this.router.get('/health', (_req: Request, res: Response) => {
      const message = `Server instance is healthy with process id ${process.pid} on ${moment().format('LL')}`
      res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, message))
    })

    return this.router
  }

  public env(): Router {
    this.router.get('/env', (_req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            `This is the ${config.NODE_ENV} environment`
          )
        )
    })

    return this.router
  }

  public database(): Router {
    this.router.get('/db', (_req: Request, res: Response) => {
      const dbStatus = getDBStatus()
      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, 'Database status', dbStatus))
    })
    return this.router
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes()
