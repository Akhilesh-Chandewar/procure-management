import { Request, Response } from "express";
import { roleCheck } from "../../decorators/role-check.decorator";
import { auth } from "../../decorators/auth.decorator";
import { OrderStatus, UserRole } from "../../constants/constants";
import { joiValidation } from "../../decorators/joi-validator.decorator";
import { createOrderSchema, getOrderByIdSchema, updateOrderSchema } from "./order.schema";
import { orderService } from "./order.service";
import HTTP_STATUS from "http-status-codes";
import { ApiResponse } from "../../helpers/apiResponse";
import { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../../helpers/errorHandler";
import { userService } from "../user/user.service";

class OrderController {
    @auth()
    @roleCheck([UserRole.PROCUREMENT_MANAGER])
    @joiValidation(createOrderSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const { clientId, description, requirements } = req.body
        const existingClient = await userService.getById(clientId)
        if (!existingClient) {
            throw new NotFoundError('Client does not exist')
        }
        if (existingClient.role !== UserRole.CLIENT) {
            throw new BadRequestError('Client does not exist')
        }
        const statusHistory = {
            status: OrderStatus.CREATED,
            updatedBy: req.id,
        }
        const order = await orderService.create({ clientId, description, requirements, procurementManagerId: req.id, statusHistory: statusHistory })

        const createdOrder = {
            id: order._id,
            orderNumber: order.orderNumber,
            clientId: order.clientId,
            description: order.description,
            requirements: order.requirements,
            procurementManagerId: order.procurementManagerId
        }
        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Order created successfully', createdOrder))
    }

    @auth()
    @roleCheck([UserRole.PROCUREMENT_MANAGER])
    @joiValidation(updateOrderSchema)
    async assignInspectionToOrder(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params
        const { inspectionManagerId } = req.body
        const inspectionManager = await userService.getById(inspectionManagerId)
        if (!inspectionManager) {
            throw new NotFoundError('Inspection Manager does not exist')
        }
        if (inspectionManager.role !== UserRole.INSPECTION_MANAGER) {
            throw new BadRequestError('Inspection Manager does not exist')
        }
        const order = await orderService.get(new Types.ObjectId(orderId))
        if (!order) {
            throw new NotFoundError('Order not found')
        }
        if(order.assignedInspectionManagerId) {
            throw new BadRequestError('Inspection Manager is already assigned to order')
        }
        const updatedOrder = await orderService.update(new Types.ObjectId(orderId), { assignedInspectionManagerId: inspectionManagerId })
        if (!updatedOrder) {
            throw new BadRequestError('Error while updating order')
        }
        const responceOrder = {
            orderNumber: updatedOrder.orderNumber,
            clientId: updatedOrder.clientId,
            inspectionManagerId: updatedOrder.assignedInspectionManagerId,
            description: updatedOrder.description,
            requirements: updatedOrder.requirements,
            procurementManagerId: updatedOrder.procurementManagerId,
            inspectionManager: updatedOrder.assignedInspectionManagerId
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Order assigned successfully', responceOrder))
    }

    @auth()
    @roleCheck([UserRole.INSPECTION_MANAGER, UserRole.PROCUREMENT_MANAGER, UserRole.CLIENT, UserRole.ADMIN])
    @joiValidation(getOrderByIdSchema)
    public async getOrderStatus(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params;
        const order = await orderService.get(new Types.ObjectId(orderId));
        if (!order) {
            throw new NotFoundError('Order not found')
        }
        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, 'Order status fetched successfully', order.statusHistory)
        );
    }
}

export const orderController = new OrderController()
