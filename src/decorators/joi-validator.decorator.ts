import { JoiRequestValidationError } from '../helpers/errorHandler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

type JoiValidationSchema = {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
};

export function joiValidation(schema: JoiValidationSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];

      if (schema.body) {
        const { error } = await Promise.resolve(schema.body.validate(req.body));
        if (error?.details) {
          throw new JoiRequestValidationError(error.details[0].message);
        }
      }

      if (schema.params) {
        const { error } = await Promise.resolve(schema.params.validate(req.params));
        if (error?.details) {
          throw new JoiRequestValidationError(error.details[0].message);
        }
      }
      
      if (schema.query) {
        const { error } = await Promise.resolve(schema.query.validate(req.query));
        if (error?.details) {
          throw new JoiRequestValidationError(error.details[0].message);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
