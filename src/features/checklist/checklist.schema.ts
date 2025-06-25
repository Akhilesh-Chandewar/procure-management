import Joi, { ObjectSchema } from 'joi';
import { QuestionType } from '../../constants/constants';

const questionTypeEnum = Object.values(QuestionType);

const questionSchema = Joi.object({
    question: Joi.string().min(3).max(200).required().messages({
        'string.base': 'Question text must be a string',
        'string.empty': 'Question text is required',
        'string.min': 'Question text is too short',
        'string.max': 'Question text is too long',
        'any.required': 'Question text is required',
    }),
    type: Joi.string()
        .valid(...questionTypeEnum)
        .required()
        .messages({
            'any.only': `Question type must be one of ${questionTypeEnum.join(', ')}`,
            'string.base': 'Question type must be a string',
            'any.required': 'Question type is required',
        }),
    isRequired: Joi.boolean().required().messages({
        'boolean.base': 'isRequired must be a boolean',
        'any.required': 'isRequired is required',
    }),
    options: Joi.array()
        .items(Joi.string().min(1).max(100))
        .when('type', {
            is: Joi.valid(QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE),
            then: Joi.required().messages({
                'any.required': 'Options are required for choice-type questions',
            }),
            otherwise: Joi.forbidden(),
        }),

    fileType: Joi.string()
        .valid('image', 'document')
        .when('type', {
            is: QuestionType.FILE_UPLOAD,
            then: Joi.required().messages({
                'any.required': 'fileType is required for file upload questions',
            }),
            otherwise: Joi.forbidden(),
        }),

});

const responseSchema = Joi.object({
    questionId: Joi.string().required().messages({
        'string.base': 'Question ID must be a string',
        'string.empty': 'Question ID is required',
        'any.required': 'Question ID is required',
    }),
    answerText: Joi.string().optional().allow(''),
    selectedOptions: Joi.array().items(Joi.string()).optional(),
    fileUrl: Joi.string().uri().optional(),
});

const checklistBodySchema: ObjectSchema = Joi.object({
    name: Joi.string().required().min(3).max(30).messages({
        'string.base': 'Name must be of type string',
        'string.min': 'Invalid name',
        'string.max': 'Invalid name',
        'string.empty': 'Name is a required field',
    }),
    description: Joi.string().required().min(3).max(300).messages({
        'string.base': 'Description must be of type string',
        'string.min': 'Invalid description',
        'string.max': 'Invalid description',
        'string.empty': 'Description is a required field',
    }),
    isDefault: Joi.boolean().messages({
        'boolean.base': 'isDefault must be of type boolean',
    }),
    isActive: Joi.boolean().messages({
        'boolean.base': 'isActive must be of type boolean',
    }),
});

const paramSchema: ObjectSchema = Joi.object({
    orderId: Joi.string().length(24).hex().required().messages({
        'string.base': 'Checklist ID must be a string',
        'string.length': 'Checklist ID must be 24 characters long',
        'string.hex': 'Checklist ID must be a valid hex string',
        'any.required': 'Checklist ID is required',
    }),
});


export const createChecklistSchema = {
    body: checklistBodySchema,
};

export const createQuestionSchema = {
    body: Joi.object({
        questions: Joi.array().items(questionSchema).min(1).required().messages({
            'array.base': 'Questions must be an array',
            'array.min': 'At least one question is required',
            'any.required': 'Questions are required',
        }),
    }),
    params: paramSchema,
};

export const createResponseSchema = {
    body: Joi.object({
        responses: Joi.array().items(responseSchema).min(1).required().messages({
            'array.base': 'Responses must be an array',
            'array.min': 'At least one response is required',
            'any.required': 'Responses are required',
        }),
    }),
    params: paramSchema,
};

