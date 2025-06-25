import { Request, Response } from 'express'
import { OrderStatus, QuestionType, UserRole } from '../../constants/constants'
import { auth } from '../../decorators/auth.decorator'
import { roleCheck } from '../../decorators/role-check.decorator'
import { checklistService } from './checklist.service'
import { ApiResponse } from '../../helpers/apiResponse'
import HTTP_STATUS from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../../helpers/errorHandler'
import { orderService } from '../order/order.service'
import { Types } from 'mongoose'
import { joiValidation } from '../../decorators/joi-validator.decorator'
import { createChecklistSchema, createResponseSchema, createQuestionSchema } from './checklist.schema'
// import { fileUpload } from '../../decorators/file-upload.decorator'
import { IResponse } from './checklist.interface'

class ChecklistController {
    @auth()
    @roleCheck([UserRole.PROCUREMENT_MANAGER, UserRole.INSPECTION_MANAGER])
    @joiValidation(createChecklistSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params
        const { name, description } = req.body
        const orderExists = await orderService.get(new Types.ObjectId(orderId))
        if (!orderExists) {
            throw new NotFoundError('Order not found')
        }
        // if(orderExists.assignedInspectionManagerId !== req.id || orderExists.procurementManagerId !== req.id) {
        //     throw new BadRequestError('User is not assigned to order')
        // }
        const checklist = await checklistService.create({ name, description, createdBy: req.id })
        if (!checklist) {
            throw new BadRequestError('Error while creating checklist')
        }
        const updatedStatusHistory = {
            status: OrderStatus.CHECKLIST_ASSIGNED,
            updatedBy: req.id
        }
        const updatedOrder = await orderService.update(new Types.ObjectId(orderId), { checklistId: checklist._id, statusHistory: updatedStatusHistory })
        if (!updatedOrder) {
            throw new BadRequestError('Error while updating order')
        }
        const createdChecklist = {
            name: checklist.name,
            description: checklist.description
        }
        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Checklist created successfully', createdChecklist))
    }

    @auth()
    @roleCheck([UserRole.PROCUREMENT_MANAGER , UserRole.INSPECTION_MANAGER])
    @joiValidation(createQuestionSchema)
    public async addQuestion(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params
        const { questions } = req.body
        const existingOrder = await orderService.get(new Types.ObjectId(orderId))
        if (!existingOrder) {
            throw new NotFoundError('Order not found')
        }
        // if (existingOrder.assignedInspectionManagerId !== req.id || existingOrder.procurementManagerId !== req.id) {
        //     throw new BadRequestError('User is not assigned to order')
        // }
        const updatedChecklist = await checklistService.addQuestion(new Types.ObjectId(existingOrder.checklistId), questions)
        if (!updatedChecklist) {
            throw new BadRequestError('Error while adding question')
        }
        const updatedStatusHistory = {
            status: OrderStatus.INSPECTION_IN_PROGRESS,
            updatedBy: req.id
        }
        const updatedOrder = await orderService.update(new Types.ObjectId(orderId), { statusHistory: updatedStatusHistory })
        if (!updatedOrder) {
            throw new BadRequestError('Error while updating order')
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Question added successfully', updatedChecklist.questions))
    }

    @auth()
    // @fileUpload()
    @roleCheck([UserRole.PROCUREMENT_MANAGER, UserRole.INSPECTION_MANAGER])
    @joiValidation(createResponseSchema)
    public async addResponse(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params
        const { responses } = req.body
        const existingOrder = await orderService.get(new Types.ObjectId(orderId))
        if (!existingOrder) {
            throw new NotFoundError('Order not found')
        }
        // if (existingOrder.assignedInspectionManagerId !== req.id || existingOrder.procurementManagerId !== req.id) {
        //     throw new BadRequestError('User is not assigned to order')
        // }
        const checklist = await checklistService.get(new Types.ObjectId(existingOrder.checklistId))
        if (!checklist) {
            throw new NotFoundError('Checklist not found')
        }

        const enrichedResponses = responses.map((response: IResponse) => {
            const question = checklist.questions.find((question) => question._id.toString() === response.questionId)
            if (!question) {
                throw new BadRequestError('Question not found')
            }
            if(question.type === QuestionType.FILE_UPLOAD) {
              return {
                ...response,
                fileUrl: response.fileUrl
              }
            }
            return response
        })
        const updatedChecklist = await checklistService.addResponse(new Types.ObjectId(existingOrder.checklistId), enrichedResponses)
        if (!updatedChecklist) {
            throw new BadRequestError('Error while adding response')
        }
        const updatedStatusHistory = {
            status: OrderStatus.INSPECTION_COMPLETED,
            updatedBy: req.id
        }
        const updatedOrder = await orderService.update(new Types.ObjectId(orderId), { statusHistory: updatedStatusHistory })
        if (!updatedOrder) {
            throw new BadRequestError('Error while updating order')
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Response added successfully', updatedChecklist.responses))
    }
}

export const checklistController: ChecklistController = new ChecklistController()