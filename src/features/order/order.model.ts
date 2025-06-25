import mongoose, { Schema } from "mongoose";
import { IOrder, IStatusHistory } from "./order.interface";

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});

export const CounterModel = mongoose.model("Counter", counterSchema);

const statusHistorySchema = new Schema<IStatusHistory>({
    status: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastUpdatedAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
    orderNumber: { type: String, unique: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    procurementManagerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedInspectionManagerId: { type: Schema.Types.ObjectId, ref: "User" },
    checklistId: { type: Schema.Types.ObjectId, ref: "Checklist" },
    checklistResponseId: { type: Schema.Types.ObjectId, ref: "ChecklistResponse",},
    description: { type: String },
    requirements: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    statusHistory: statusHistorySchema,
});

orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "orderNumber" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.orderNumber = `ORD-${counter.seq.toString().padStart(5, "0")}`;
    }
    next();
});

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema , "Order");

