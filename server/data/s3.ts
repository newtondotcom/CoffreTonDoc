import { Client } from 'minio';
import prisma from './prisma';
import constants from '~/lib/constants';
import { assert } from '@vueuse/core';

export default function generateUniqueName() {
    const date = new Date();
    const timestamp = date.getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueName = `${timestamp}_${randomString}`;
    return uniqueName;
}

export async function removeVideo(user_id : string, videoId: string) {
    try {
        // get video object from database
        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
            },
            select: {
                name_s3: true,
                user_id: true,
                stored: true,
            }
        });

        assert(video?.user_id == user_id);

        //const s3Name = video?.stored;
        const s3Name = constants.NAME_S3_DOWNLOADS;
        const config = await prisma.s3.findUnique({
            where: {
                name: s3Name,
            }
        });

        const MINIO_ENDPOINT = config.endpoint;
        const MINIO_PORT = config.port;
        const MINIO_ACCESS_KEY = config.access_key;
        const MINIO_SECRET_KEY = config.secret_key;
        const MINIO_SSL = config.ssl;
        const bucketName = config.bucket;

        // remove video object from MinIO
        const minioClient = new Client({
            endPoint: MINIO_ENDPOINT,
            port: parseInt(MINIO_PORT),
            useSSL: MINIO_SSL,
            accessKey: MINIO_ACCESS_KEY,
            secretKey: MINIO_SECRET_KEY,
        });

        const objectName = video.name_s3;
        minioClient.removeObject(bucketName, objectName, (err) => {
            if (err) {
                console.error('Error removing video object:', err);
            } else {
                console.log('Video object removed successfully:', objectName);
            }
        });

        // remove 1 videos for the current number of videos stored
        await prisma.account.update({
            where: { user_id: video.user_id },
            data: {
                videos_stored: {
                    decrement: 1
                },
            },
        });

        // mark the video as deleted
        await prisma.video.update({
            where: { id: videoId },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        console.error('Error removing video:', error);
    }
}

export async function createPresignedUrlUpload(user_id: any) {
    const s3Name = constants.NAME_S3_UPLOADS;
    const config = await prisma.s3.findUnique({
        where: {
            name: s3Name,
        }
    });

    const MINIO_ENDPOINT = config.endpoint;
    const MINIO_PORT = config.port;
    const MINIO_ACCESS_KEY = config.access_key;
    const MINIO_SECRET_KEY = config.secret_key;
    const MINIO_SSL = config.ssl;
    const bucketName = config.bucket;

    const minioClient = new Client({
        endPoint: MINIO_ENDPOINT,
        port: parseInt(MINIO_PORT),
        useSSL: MINIO_SSL,
        accessKey: MINIO_ACCESS_KEY,
        secretKey: MINIO_SECRET_KEY,
    });
    const objectName = generateUniqueName() + '.mp4';
    const expiryInSeconds = 3600;
    const url = await minioClient.presignedPutObject(bucketName, objectName, expiryInSeconds);
    return { url, objectName, s3Name};
}

export async function createPresignedUrlDownload(user_id:any, objectName: any) {
    const config = useRuntimeConfig();
    const MINIO_ENDPOINT = config.endpoint;
    const MINIO_PORT = config.port;
    const MINIO_ACCESS_KEY = config.access_key;
    const MINIO_SECRET_KEY = config.secret_key;
    const MINIO_SSL = config.ssl;
    const bucketName = config.bucket;

    const minioClient = new Client({
        endPoint: MINIO_ENDPOINT,
        port: parseInt(MINIO_PORT),
        useSSL: MINIO_SSL,
        accessKey: MINIO_ACCESS_KEY,
        secretKey: MINIO_SECRET_KEY,
    });
    const expiryInSeconds = 3600;
    //const url = await minioClient.presignedGetObject(bucketName, objectName, expiryInSeconds);
    const url = "test"
    return url;
}

export async function insertS3Server(name: any, endpoint: any, port: any, ssl: boolean, accessKey: any, secretKey: any, bucketName: any) {
    await prisma.s3.create({
        data: {
            name: name,
            endpoint: endpoint,
            port: port,
            access_key: accessKey,
            secret_key: secretKey,
            bucket: bucketName,
            ssl: ssl
        }
    });
}