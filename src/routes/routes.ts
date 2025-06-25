import { Application } from 'express'
import { healthRoutes } from '../features/healthcheck/healthcheck.route'
import { userRoute } from '../features/user/user.route'
import { orderRoute } from '../features/order/order.route'
import { checklist } from '../features/checklist/checklist.route'

const BASE_URL = '/api/v1'

export default (app: Application) => {
  app.use('', healthRoutes.health())
  app.use('', healthRoutes.env())
  app.use('', healthRoutes.database())

  app.use(BASE_URL.concat('/user') , userRoute.user())
  app.use(BASE_URL.concat('/order') , orderRoute.order())
  app.use(BASE_URL.concat('/checklist') , checklist.checklist())
}
