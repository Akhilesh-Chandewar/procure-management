import { Types } from "mongoose"
import { OrderStatus } from "../../constants/constants"

export interface IOrder {
    _id: Types.ObjectId
    orderNumber: string
    clientId: Types.ObjectId
    procurementManagerId: Types.ObjectId
    assignedInspectionManagerId: Types.ObjectId
    checklistId: Types.ObjectId
    checklistResponseId: Types.ObjectId
    description: string
    requirements: string
    createdAt: Date
    updatedAt: Date
    statusHistory: IStatusHistory
}

export interface IStatusHistory {
    status: OrderStatus
    updatedBy: Types.ObjectId
    lastUpdatedAt?: Date
}

export interface ICreateOrder extends Partial<IOrder> {
    clientId: Types.ObjectId
    description: string
    requirements: string
    statusHistory: IStatusHistory
    checklistId?: Types.ObjectId
}