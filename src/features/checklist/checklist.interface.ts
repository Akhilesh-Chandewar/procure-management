import { Types } from 'mongoose';
import { QuestionType } from '../../constants/constants';

export interface IQuestion {
    _id: Types.ObjectId;
    question: string;
    type: QuestionType;
    isRequired: boolean;
    options?: string[];
    fileType?: 'image' ;
}

export interface IResponse {
    questionId: string; 
    answerText: string;
    selectedOptions?: string[];
    fileUrl?: string;
    respondentId: Types.ObjectId;
    createdAt: Date;
}

export interface IChecklist {
    _id: Types.ObjectId;
    name: string;
    description: string;
    isDefault: boolean;
    isActive: boolean;
    createdBy: Types.ObjectId;
    questions: IQuestion[];
    responses: IResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateChecklist extends Partial<IChecklist> {
    name: string;
    description: string;
    isDefault?: boolean;
    isActive?: boolean;
    createdBy: Types.ObjectId;
}
