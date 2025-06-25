import Joi, { ObjectSchema } from 'joi';

const registrationBodySchema: ObjectSchema = Joi.object({
    firstName: Joi.string().required().min(3).max(30).messages({
        'string.base': 'First name must be of type string',
        'string.min': 'Invalid first name',
        'string.max': 'Invalid first name',
        'string.empty': 'First name is a required field'
    }),
    lastName: Joi.string().required().min(3).max(30).messages({
        'string.base': 'Last name must be of type string',
        'string.min': 'Invalid last name',
        'string.max': 'Invalid last name',
        'string.empty': 'Last name is a required field'
    }),
    email: Joi.string().required().email().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Email must be valid',
        'string.empty': 'Email is a required field'
    }),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
        'string.base': 'Mobile number must be of type string',
        'string.length': 'Mobile number must be exactly 10 digits',
        'string.pattern.base': 'Mobile number must contain only digits',
        'string.empty': 'Mobile number is a required field'
    }),
    password: Joi.string().required().min(4).messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Invalid password',
        'string.empty': 'Password is a required field'
    }),
});

const loginBodySchema: ObjectSchema = Joi.object({
    email: Joi.string().email().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Email must be valid',
        'string.empty': 'Email is a required field'
    }),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).messages({
        'string.base': 'Mobile number must be of type string',
        'string.length': 'Mobile number must be exactly 10 digits',
        'string.pattern.base': 'Mobile number must contain only digits',
        'string.empty': 'Mobile number is a required field'
    }),
    password: Joi.string().required().min(4).messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Invalid password',
        'string.empty': 'Password is a required field'
    }),
}).or('email', 'mobile').messages({
    'object.missing': 'Either email or mobile must be provided',
});

export const userRegistrationSchema = { body: registrationBodySchema };
export const userLoginSchema = { body: loginBodySchema };
