import { promises as fs } from 'node:fs';
import path from 'node:path';
import streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

type ResourceType = 'image' | 'video' | 'raw';
type FileLike = Express.Multer.File | string;   

interface UploadOptions {
    fileBuffer: Buffer;
    filename: string;
}

async function toUploadOptions(file: FileLike): Promise<UploadOptions> {
    if (typeof file === 'string') {
        return { fileBuffer: await fs.readFile(file), filename: path.basename(file) };
    }
    const fileBuffer = file.buffer ?? (await fs.readFile(file.path));                 
    const filename = file.originalname ?? path.basename(file.path);
    return { fileBuffer, filename };
}

function getResourceType(filename: string): ResourceType {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return 'raw';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'video';
    return 'raw';
}

export async function uploadToCloudinary(file: FileLike): Promise<UploadApiResponse> {
    const { fileBuffer, filename } = await toUploadOptions(file);
    const resourceType = getResourceType(filename);

    return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType, public_id: path.parse(filename).name },
            (error, result) => (error ? reject(error) : resolve(result!))
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}
