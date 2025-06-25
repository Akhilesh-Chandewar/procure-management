import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose'
import jwt from "jsonwebtoken";

import { NotAuthorizedError } from "../helpers/errorHandler";
import { config } from "../config/config";
import { userService } from "../features/user/user.service";

type IAuthDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;
interface JwtPayloadWithId extends jwt.JwtPayload {
    id: Types.ObjectId;
}

export function auth(): IAuthDecorator {
    return (_target, _key, descriptor) => {
        const original = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const token = req.cookies?.accessToken;
                if (!token) {
                    throw new NotAuthorizedError("Authorization token not found");
                }

                const payload = jwt.verify(token, config.ACCESS_TOKEN_KEY!) as JwtPayloadWithId;

                const user = await userService.getById(payload.id);
                if (!user) {
                    throw new NotAuthorizedError("User not found");
                }

                req.role = user.role;
                req.id = user._id;

                return original.apply(this, [req, res, next]);
            } catch (err) {
                next(err);
            }
        };
    };
}
