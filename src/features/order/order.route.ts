import { Router } from "express"
import { orderController } from "./order.controller"

class OrderRoute {
    private router: Router
    constructor() {
        this.router = Router()
    }

    public order(): Router {
        this.router.post('/create', orderController.create)
        this.router.post('/assign-inspection-to-order/:orderId', orderController.assignInspectionToOrder)
        this.router.get('/get-order-status/:orderId', orderController.getOrderStatus)
        return this.router
    }
}

export const orderRoute = new OrderRoute()