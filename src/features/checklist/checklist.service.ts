import { Checklist } from "./checklist.model"
import { ICreateChecklist, IQuestion, IResponse } from "./checklist.interface";
import { Types } from "mongoose";

class ChecklistService {
    public async create(checklist: ICreateChecklist) {
        return await Checklist.create(checklist)
    }

    public async get(checklistId: Types.ObjectId) {
        const checklist = await Checklist.findById(checklistId)
        return checklist
    }

    public async addQuestion(checklistId: Types.ObjectId, questions: IQuestion) {
        const updatedChecklist = await Checklist.findOneAndUpdate({ _id: checklistId }, { $push: { questions: questions } }, { new: true })
        return updatedChecklist
    }

    public async addResponse(checklistId: Types.ObjectId, responses: IResponse) {
        const updatedChecklist = await Checklist.findOneAndUpdate({ _id: checklistId }, { $push: { responses: responses } }, { new: true })
        return updatedChecklist
    }

}

export const checklistService = new ChecklistService()