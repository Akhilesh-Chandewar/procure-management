import { Router } from 'express'
import { userController } from './user.controller'

class userRoutes {
    private router: Router
    constructor() {
        this.router = Router()
    }

    public user(): Router {
        this.router.post('/admin', userController.registerAdmin)
        this.router.post('/procure-manager', userController.registerProcureManager)
        this.router.post('/inspection-manager', userController.registerInspectionManager)
        this.router.post('/client', userController.registerClient)
        this.router.post('/assign-inspection-to-procure', userController.assignInspectionToProcure)
        this.router.get('/get-users', userController.getUsers)
        this.router.get('/get-user-by-id/:id', userController.getUserById)
        this.router.get('/me', userController.me)
        this.router.post('/login', userController.login)
        this.router.post('/logout', userController.logout)

        return this.router
    }
}

export const userRoute = new userRoutes()