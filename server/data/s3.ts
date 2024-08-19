import { Client } from 'minio';
import prisma from './prisma';

const name_s3_vault = 'vault';

export function generateUniqueName() {
    const date = new Date();
    const timestamp = date.getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueName = `${timestamp}_${randomString}`;
    return uniqueName;
}

export async function createPresignedUrlUpload(uname: string) {
    const config = await prisma.s3.findUnique({
        where: {
            name: name_s3_vault,
        },
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
    const expiryInSeconds = 3600;
    const url = await minioClient.presignedPutObject(bucketName, uname, expiryInSeconds);
    return url;
}

export async function createPresignedUrlDownload(objectName: any) {
    const config = await prisma.s3.findUnique({
        where: {
            name: name_s3_vault,
        },
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
    const expiryInSeconds = 3600;
    const url = await minioClient.presignedGetObject(bucketName, objectName, expiryInSeconds);
    return url;
}

export async function insertS3Server(
    name: any,
    endpoint: any,
    port: any,
    ssl: Boolean,
    accessKey: any,
    secretKey: any,
    bucketName: any,
) {
    await prisma.s3.create({
        data: {
            name: name,
            endpoint: endpoint,
            port: port,
            access_key: accessKey,
            secret_key: secretKey,
            bucket: bucketName,
            ssl: ssl,
        },
    });
}
