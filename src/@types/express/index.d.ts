import { Types } from 'mongoose';
import { UserRole } from '../../constants/constants';

import 'multer';

declare global {
    namespace Express {
        interface Request {
            id: Types.ObjectId;
            role: UserRole;
            file?: Express.Multer.File;
            files?: Express.Multer.File[];
            uploadUrl?: string;
        }
    }
}

export { };
