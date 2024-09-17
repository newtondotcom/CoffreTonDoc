import { defineEventHandler } from 'h3';
import prisma from '../data/prisma';
import { createPresignedUrlDownload, createPresignedUrlUpload } from '../data/s3';

export default defineEventHandler(async (event) => {
    const objectName = 'test';
    const link = await createPresignedUrlUpload(objectName);
    const download = await createPresignedUrlDownload(objectName);
    return { link, download };
});
