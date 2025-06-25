import { Router } from "express"
import { checklistController } from "./checklist.controller"

class ChecklistRoute{
    private router:Router

    constructor(){
        this.router = Router()
    }

    public checklist(): Router{
        this.router.post('/create/:orderId', checklistController.create)
        this.router.post('/add-question/:orderId', checklistController.addQuestion)
        this.router.post('/add-responses/:orderId', checklistController.addResponse)
        return this.router
    }
}

export const checklist = new ChecklistRoute()