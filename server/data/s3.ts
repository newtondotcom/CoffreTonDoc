import { Client } from 'minio';
import prisma from './prisma';
import constants from '~/lib/constants';
import { setFileRecordDeleted } from './files';

/**
 * Generates a unique name based on the current timestamp and a random string.
 * @returns {string} The generated unique name.
 */
export function generateUniqueName(): string {
    const date = new Date();
    const timestamp = date.getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueName = `${timestamp}_${randomString}`;
    return uniqueName;
}

/**
 * Creates a presigned URL for uploading a file to MinIO.
 * @param {string} uname - The unique name for the file to be uploaded.
 * @returns {Promise<string>} The presigned URL for uploading the file.
 */
export async function createPresignedUrlUpload(uname: string): Promise<string> {
    const config = await prisma.s3.findUnique({
        where: {
            name: constants.name_s3_vault,
        },
    });

    const minioClient = new Client({
        endPoint: config.endpoint,
        port: config.port,
        useSSL: config.ssl,
        accessKey: config.access_key,
        secretKey: config.secret_key,
    });

    const expiryInSeconds = 3600;
    const url = await minioClient.presignedPutObject(config.bucket, uname, expiryInSeconds);
    return url;
}

/**
 * Creates a presigned URL for downloading a file from MinIO.
 * @param {string} objectName - The name of the object to be downloaded.
 * @returns {Promise<string>} The presigned URL for downloading the file.
 */
export async function createPresignedUrlDownload(objectName: string): Promise<string> {
    const config = await prisma.s3.findUnique({
        where: {
            name: constants.name_s3_vault,
        },
    });

    const minioClient = new Client({
        endPoint: config.endpoint,
        port: parseInt(config.port),
        useSSL: config.ssl,
        accessKey: config.access_key,
        secretKey: config.secret_key,
    });

    const expiryInSeconds = 3600;
    const url = await minioClient.presignedGetObject(config.bucket, objectName, expiryInSeconds);
    return url;
}

/**
 * Deletes a file from MinIO and marks the file record as deleted in the database.
 * @param {string} name - The name of the file to be deleted.
 * @returns {Promise<void>}
 */
export async function deleteFile(name: string): Promise<void> {
    const config = await prisma.s3.findUnique({
        where: {
            name: constants.name_s3_vault,
        },
    });

    const minioClient = new Client({
        endPoint: config.endpoint,
        port: config.port,
        useSSL: config.ssl,
        accessKey: config.access_key,
        secretKey: config.secret_key,
    });

    await minioClient.removeObject(config.bucket, name);
    await setFileRecordDeleted(name);
}

/**
 * Inserts a new S3 server configuration into the database.
 * @param {string} name - The name of the S3 server.
 * @param {string} endpoint - The endpoint URL of the S3 server.
 * @param {number} port - The port number for the S3 server.
 * @param {boolean} ssl - Whether to use SSL for the S3 server.
 * @param {string} accessKey - The access key for the S3 server.
 * @param {string} secretKey - The secret key for the S3 server.
 * @param {string} bucketName - The name of the bucket on the S3 server.
 * @returns {Promise<void>}
 */
export async function insertS3Server(
    name: string,
    endpoint: string,
    port: number,
    ssl: boolean,
    accessKey: string,
    secretKey: string,
    bucketName: string,
): Promise<void> {
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
