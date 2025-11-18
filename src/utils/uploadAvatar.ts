import multer from 'multer'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import {s3Client} from "@/config/aws";
import {Request, Response} from "express";

export const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: Request, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
        cb(null, true);
    }
});

export const deleteFileFromS3 = async (fileUrl: string) => {
    if (!fileUrl) return;

    try {
        const key = fileUrl.split('.com/')[1];
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }));
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};
