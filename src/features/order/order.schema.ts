import Joi, { ObjectSchema } from 'joi';

const createOrderBodySchema: ObjectSchema = Joi.object({
    clientId: Joi.string().length(24).hex().required().messages({
        'string.base': 'Order ID must be a string',
        'string.length': 'Order ID must be 24 characters long',
        'string.hex': 'Order ID must be a valid hex string',
        'any.required': 'Order ID is required',
    }),
    description: Joi.string().trim().min(3).max(300).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is a required field',
        'string.min': 'Description must be at least 3 characters',
        'string.max': 'Description must not exceed 300 characters',
        'any.required': 'Description is a required field',
    }),
    requirements: Joi.string().trim().min(3).max(300).required().messages({
        'string.base': 'Requirements must be a string',
        'string.empty': 'Requirements is a required field',
        'string.min': 'Requirements must be at least 3 characters',
        'string.max': 'Requirements must not exceed 300 characters',
        'any.required': 'Requirements is a required field',
    }),
});

const orderParamsSchema: ObjectSchema = Joi.object({
    orderId: Joi.string().length(24).hex().required().messages({
        'string.base': 'Order ID must be a string',
        'string.length': 'Order ID must be 24 characters long',
        'string.hex': 'Order ID must be a valid hex string',
        'any.required': 'Order ID is required',
    }),
});

export const createOrderSchema = {
    body: createOrderBodySchema,
};

export const getOrderByIdSchema = {
    params: orderParamsSchema,
};

export const updateOrderSchema = {
    body: Joi.object({
        inspectionManagerId: Joi.string().length(24).hex().required().messages({
            'string.base': 'Inspection Manager ID must be a string',
            'string.length': 'Inspection Manager ID must be 24 characters long',
            'string.hex': 'Inspection Manager ID must be a valid hex string',
            'any.required': 'Inspection Manager ID is required',
        }),
    }),
    params: orderParamsSchema,
};
