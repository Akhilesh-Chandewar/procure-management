import { OrderModel } from "./order.model";
import { ICreateOrder } from "./order.interface";
import { Types } from "mongoose";

class OrderService {
    public async create(order: ICreateOrder) {
        return await OrderModel.create(order); 
    }

    public async get(orderId: Types.ObjectId) {
        const order = await OrderModel.findById(orderId).exec()
        return order
    }

    public async update(orderId: Types.ObjectId, data: Partial<ICreateOrder>) {
        return await OrderModel.findByIdAndUpdate(orderId, data, { new: true }).exec()
    }
}

export const orderService = new OrderService();
