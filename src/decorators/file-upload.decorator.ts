import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../helpers/cloudinaryUpload';

type IFileUploadDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function fileUpload(): IFileUploadDecorator {
    return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function ( req: Request, res: Response, next: NextFunction) {
            try {
                if (req.file) {
                    const result = await uploadToCloudinary(req.file);
                    req.uploadUrl = result.secure_url;
                    return originalMethod.apply(this, [req, res, next]);
                } else {
                    next()
                }
            } catch (err) {
                next(err);
            }
        };
    };
}
