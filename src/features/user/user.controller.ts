import { Request, Response } from 'express'
import { joiValidation } from '../../decorators/joi-validator.decorator'
import { auth } from '../../decorators/auth.decorator'
import { UserRole } from '../../constants/constants'
import { BadRequestError, NotFoundError } from '../../helpers/errorHandler'
import { userService } from './user.service'
import { userRegistrationSchema, userLoginSchema } from './user.schema'
import HTTP_STATUS from 'http-status-codes';
import { ApiResponse } from '../../helpers/apiResponse'
import { roleCheck } from '../../decorators/role-check.decorator'
import { IUser } from './user.interface'
import { Types } from 'mongoose'

class UserController {
    @joiValidation(userRegistrationSchema)
    public async registerAdmin(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, mobile, password } = req.body

        const existingUser = await userService.getByEmail(email) || await userService.getByMobile(mobile)
        if (existingUser) {
            throw new BadRequestError('User already exists')
        }

        const user = await userService.create({ firstName, lastName, email, mobile, password, role: UserRole.ADMIN })
        if (!user) {
            throw new BadRequestError('Error while creating user')
        }

        const accessToken = userService.genrateAccessToken(user._id)
        const refreshToken = userService.genrateRefreshToken(user._id)

        const registeredUser = {
            id : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            role: user.role
        }

        res
            .status(HTTP_STATUS.CREATED)
            .cookie('accessToken', accessToken, { httpOnly: true })
            .cookie('refreshToken', refreshToken, { httpOnly: true })
            .json(new ApiResponse(HTTP_STATUS.CREATED, 'User created successfully', { registeredUser, accessToken, refreshToken }))

    }

    @auth()
    @roleCheck([UserRole.ADMIN])
    @joiValidation(userRegistrationSchema)
    public async registerProcureManager(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, mobile, password } = req.body

        const existingUser = await userService.getByEmail(email) || await userService.getByMobile(mobile)
        if (existingUser) {
            throw new BadRequestError('User already exists')
        }

        const user = await userService.create({ firstName, lastName, email, mobile, password, role: UserRole.PROCUREMENT_MANAGER, createdBy: req.id, assignedTo: req.id })
        if (!user) {
            throw new BadRequestError('Error while creating user')
        }

        const createdUser = {
            id : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdBy: user.createdBy,
            assignedTo: user.assignedTo
        }

        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'User created successfully', createdUser))
    }

    @auth()
    @roleCheck([UserRole.ADMIN, UserRole.PROCUREMENT_MANAGER])
    @joiValidation(userRegistrationSchema)
    public async registerInspectionManager(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, mobile, password } = req.body

        const existingUser = await userService.getByEmail(email) || await userService.getByMobile(mobile)
        if (existingUser) {
            throw new BadRequestError('User already exists')
        }

        const user = await userService.create({ firstName, lastName, email, mobile, password, role: UserRole.INSPECTION_MANAGER, createdBy: req.id, assignedTo: req.id })
        if (!user) {
            throw new BadRequestError('Error while creating user')
        }

        const createdUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdBy: user.createdBy,
            assignedTo: user.assignedTo
        }

        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'User created successfully', createdUser))
    }

    @auth()
    @roleCheck([UserRole.ADMIN, UserRole.PROCUREMENT_MANAGER, UserRole.INSPECTION_MANAGER])
    @joiValidation(userRegistrationSchema)
    public async registerClient(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, mobile, password } = req.body

        const existingUser = await userService.getByEmail(email) || await userService.getByMobile(mobile)
        if (existingUser) {
            throw new BadRequestError('User already exists')
        }

        const user = await userService.create({ firstName, lastName, email, mobile, password, role: UserRole.CLIENT, createdBy: req.id, assignedTo: req.id })
        if (!user) {
            throw new BadRequestError('Error while creating user')
        }

        const createdUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdBy: user.createdBy,
            assignedTo: user.assignedTo
        }

        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'User created successfully', createdUser))
    }

    @auth()
    @roleCheck([UserRole.ADMIN])
    public async assignInspectionToProcure(req: Request, res: Response): Promise<void> {
        const { inspectionId, procureId } = req.body

        const inspection = await userService.getById(inspectionId)
        if (!inspection) {
            throw new NotFoundError('Inspection does not exist')
        }

        const procure = await userService.getById(procureId)
        if (!procure) {
            throw new NotFoundError('Procure does not exist')
        }

        const updatedInspection = await userService.update(inspectionId, { assignedTo: procureId })
        if (!updatedInspection) {
            throw new BadRequestError('Error while assigning inspection to procure')
        }

        const inspectionManager = {
            id: updatedInspection._id,
            firstName: updatedInspection.firstName,
            lastName: updatedInspection.lastName,
            email: updatedInspection.email,
            mobile: updatedInspection.mobile,
            role: updatedInspection.role,
            assignedTo: updatedInspection.assignedTo
        }

        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Inspection assigned to procure successfully', inspectionManager))
    }

    @auth()
    public async getUsers(req: Request, res: Response): Promise<void> {
        const users = await userService.filter({ assignedTo: req.id })
        if (!users) {
            throw new NotFoundError('User does not exist')
        }
        const responseUsers = users.map((user) => {
            return {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        })
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'User fetched successfully', responseUsers))
    }

    @auth()
    public async getUserById(req: Request, res: Response): Promise<void> {
        const { userId } = req.params
        const user = await userService.getById(new Types.ObjectId(userId))
        if (!user) {
            throw new NotFoundError('User does not exist')
        }
        const responseUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdBy: user.createdBy,
            assignedTo: user.assignedTo
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'User fetched successfully', responseUser))
    }

    @joiValidation(userLoginSchema)
    public async login(req: Request, res: Response): Promise<void> {
        const { email, mobile, password } = req.body

        let user: IUser | null = null;

        if (email) {
            user = await userService.getByEmail(email)
        } else if (mobile) {
            user = await userService.getByMobile(mobile)
        }

        if (!user) {
            throw new NotFoundError('User does not exist')
        }

        if (!user.isActive) {
            throw new BadRequestError('User is not active')
        }

        const isPasswordValid = await userService.comparePassword(password, user.password)
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid password')
        }

        const accessToken = userService.genrateAccessToken(user._id)
        const refreshToken = userService.genrateRefreshToken(user._id)

        res
            .status(HTTP_STATUS.OK)
            .cookie('accessToken', accessToken, { httpOnly: true })
            .cookie('refreshToken', refreshToken, { httpOnly: true })
            .json(new ApiResponse(HTTP_STATUS.OK, 'User logged in successfully', { accessToken, refreshToken }))
    }

    @auth()
    public async me(req: Request, res: Response): Promise<void> {
        const user = await userService.getById(req.id)
        if (!user) {
            throw new NotFoundError('User does not exist')
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'User fetched successfully', user))
    }

    @auth()
    public async logout(_req: Request, res: Response): Promise<void> {
        res
            .status(HTTP_STATUS.OK)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(new ApiResponse(HTTP_STATUS.OK, 'User logged out successfully'))
    }
}

export const userController = new UserController()