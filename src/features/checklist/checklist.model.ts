import { Schema, model, Model } from 'mongoose';
import { IChecklist, IQuestion, IResponse } from './checklist.interface';
import { QuestionType } from '../../constants/constants';

const questionSchema = new Schema<IQuestion>(
    {
        question: { type: String, required: true },
        type: { type: String, required: true, enum: Object.values(QuestionType) },
        isRequired: { type: Boolean, default: false },
        options: [{ type: String }],
        fileType: { type: String, enum: ['image'] },
    },
    { _id: true }
);

const responseSchema = new Schema<IResponse>(
    {
        questionId: { type: String, required: true },
        answerText: { type: String },
        selectedOptions: [{ type: String }],
        fileUrl: { type: String },
        respondentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const checklistSchema = new Schema<IChecklist>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        questions: [questionSchema],
        responses: [responseSchema]
    },
    { timestamps: true }
);

checklistSchema.index({ createdBy: 1, isActive: 1 });
checklistSchema.index({ isDefault: 1, isActive: 1 });
checklistSchema.index({ name: 'text', description: 'text' });
checklistSchema.index({ version: -1, _id: 1 });

export const Checklist: Model<IChecklist> = model<IChecklist>('Checklist', checklistSchema , "Checklist");
