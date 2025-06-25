import { Request, Response, NextFunction } from "express";
import { UserRole } from "../constants/constants";
import { BadRequestError } from "../helpers/errorHandler";

type IRoleDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function roleCheck(role: UserRole[]): IRoleDecorator {
    return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
           try {
                if (role.includes(req.role!)) {
                    return originalMethod.apply(this, [req, res, next]);
                } else {
                    throw new BadRequestError('You are not authorized to access this route');
                }
            } catch (err) {
                next(err);
            }
        }
    }
}