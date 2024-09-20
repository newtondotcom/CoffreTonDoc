import { assert } from '@vueuse/core';
import prisma from './prisma';
import { File, AccessStatus } from '@prisma/client';
import constants from '~/lib/constants';

/**
 * Get all files within a folder for a specific user.
 * @param {number} folderId - The ID of the parent folder.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File[]>} - A promise that resolves to an array of files.
 * @throws {Error} - If an error occurs while fetching the files.
 */
export async function getFilesInFolder(folderId: number, user_id: string): Promise<File[]> {
    try {
        return await prisma.file.findMany({
            where: {
                idParent: folderId,
                user_id: user_id,
                deleted_at: null,
            },
        });
    } catch (error) {
        console.error('Error fetching files in folder:', error);
        throw new Error('Failed to fetch files in folder');
    }
}

/**
 * Get a specific file by ID for a specific user.
 * @param {number} fileId - The ID of the file.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File | null>} - A promise that resolves to the file or null if not found.
 * @throws {Error} - If an error occurs while fetching the file.
 */
export async function getFileById(fileId: number, user_id: string): Promise<File | null> {
    try {
        return await prisma.file.findUnique({
            where: {
                id: fileId,
                user_id: user_id,
            },
        });
    } catch (error) {
        console.error('Error fetching file by ID:', error);
        throw new Error('Failed to fetch file by ID');
    }
}

/**
 * Create a new file.
 * @param {string} name - The name of the file.
 * @param {string} extension - The extension of the file.
 * @param {number} idParent - The ID of the parent folder.
 * @param {number} size - The size of the file.
 * @param {AccessStatus} statut - The access status of the file.
 * @param {string} user_id - The ID of the user.
 * @param {string} name_on_s3 - The name of the file on S3.
 * @returns {Promise<number>} - A promise that resolves to the created file.
 * @throws {Error} - If an error occurs while creating the file.
 */
export async function createFile(
    name: string,
    extension: string,
    idParent: number,
    size: number,
    statut: AccessStatus,
    user_id: string,
    name_on_s3: string,
): Promise<number> {
    try {
        const file = await prisma.file.create({
            data: {
                name,
                extension,
                size,
                statut,
                idParent,
                isFolder: false,
                user_id: user_id,
                file_name_on_s3: name_on_s3,
                s3_server_name: constants.name_s3_vault,
            },
        });
        return file.id;
    } catch (error) {
        console.error('Error creating file:', error);
        throw new Error('Failed to create file');
    }
}

/**
 * Create a new folder.
 * @param {string} name - The name of the folder.
 * @param {number} idParent - The ID of the parent folder.
 * @param {string} statut - The access status of the folder.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File>} - A promise that resolves to the created folder.
 * @throws {Error} - If an error occurs while creating the folder.
 */
export async function createFolder(
    name: string,
    idParent: number,
    statut: AccessStatus,
    user_id: string,
): Promise<File> {
    try {
        return await prisma.file.create({
            data: {
                name,
                idParent,
                size: 0,
                statut,
                isFolder: true,
                user_id: user_id, // Set user_id
            },
            select: {
                id: true,
            },
        });
    } catch (error) {
        console.error('Error creating folder:', error);
        throw new Error('Failed to create folder');
    }
}

/**
 * Rename a file or folder.
 * @param {number} fileId - The ID of the file or folder to rename.
 * @param {string} newName - The new name.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File>} - A promise that resolves to the updated file or folder.
 * @throws {Error} - If an error occurs while renaming the file or folder.
 */
export async function renameFile(fileId: number, newName: string, user_id: string): Promise<File> {
    try {
        assert(user_id == (await prisma.file.findUnique({ where: { id: fileId } })).user_id);
        return await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                name: newName,
            },
        });
    } catch (error) {
        console.error('Error renaming file/folder:', error);
        throw new Error('Failed to rename file/folder');
    }
}

/**
 * Replace a file's data by updating its associated S3 name and size.
 * @param {string} user_id - The ID of the user.
 * @param {number} fileId - The ID of the file to replace.
 * @param {string} uname - The new unique name for the file on S3.
 * @param {number} size - The new size of the file.
 * @returns {Promise<File>} - A promise that resolves to the updated file.
 * @throws {Error} - If an error occurs while replacing the file.
 */
export async function replaceFile(
    user_id: string,
    fileId: number,
    size: number,
    name_on_s3: string,
) {
    try {
        assert(user_id == (await prisma.file.findUnique({ where: { id: fileId } })).user_id);
        await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                size: size,
                date: new Date(),
                file_name_on_s3: name_on_s3,
            },
        });
    } catch (error) {
        console.error('Error replacing file:', error);
        throw new Error('Failed to replace file');
    }
}

/**
 * Check if a file already exists in a specific folder for a user.
 * @param {string} name - The name of the file.
 * @param {string} extension - The extension of the file.
 * @param {number} idParent - The ID of the parent folder.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File | null>} - A promise that resolves to the file if it exists, otherwise null.
 * @throws {Error} - If an error occurs while checking for the file.
 */
export async function fileExists(
    name: string,
    extension: string,
    idParent: number,
    user_id: string,
) {
    try {
        return await prisma.file.findFirst({
            where: {
                name: name,
                extension: extension,
                idParent: idParent,
                user_id: user_id,
                isFolder: false,
            },
        });
    } catch (error) {
        console.error('Error finding file:', error);
        throw new Error('Failed to find file');
    }
}

/**
 * Check if a folder already exists in a specific folder for a user.
 * @param {string} name - The name of the folder.
 * @param {number} idParent - The ID of the parent folder.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<File | null>} - A promise that resolves to the folder if it exists, otherwise null.
 * @throws {Error} - If an error occurs while checking for the folder.
 */
export async function folderExists(name: string, idParent: number, user_id: string) {
    try {
        return await prisma.file.findFirst({
            where: {
                name: name,
                idParent: idParent,
                user_id: user_id,
                isFolder: true,
            },
        });
    } catch (error) {
        console.error('Error finding folder:', error);
        throw new Error('Failed to find folder');
    }
}

/**
 * Creates a record of a file that needs to be deleted.
 * The record includes the file ID, the file name on S3, and the S3 server name.
 *
 * @param {number} fileId - The ID of the file to be recorded for deletion.
 * @returns {Promise<void>}
 * @throws Will throw an error if the record creation fails.
 */
export async function createRecordFileToDelete(fileId: number): Promise<void> {
    try {
        const file = await prisma.file.findUnique({ where: { id: fileId } });
        await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                deleted_at: new Date(),
            },
        });
        await prisma.fileToDelete.create({
            data: {
                file_id: fileId,
                file_name_on_s3: file?.file_name_on_s3,
                s3_server_name: file?.s3_server_name,
            },
        });
    } catch (error) {
        console.error('Error creating record file to delete:', error);
        throw new Error('Failed to create record file to delete');
    }
}

/**
 * Marks a file record as deleted in the database by setting the `deleted_at` timestamp.
 *
 * @param {string} name - The name of the file on S3 to mark as deleted.
 * @returns {Promise<void>}
 * @throws Will throw an error if the update fails.
 */
export async function setFileRecordDeleted(name: string): Promise<void> {
    const file = await prisma.fileToDelete.findFirst({ where: { file_name_on_s3: name } });
    try {
        await prisma.fileToDelete.update({
            where: {
                file_id: file.id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    } catch (error) {
        console.error('Error setting file record deleted:', error);
        throw new Error('Failed to set file record deleted');
    }
}
