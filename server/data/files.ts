import prisma from './prisma';
import { File } from '@prisma/client';

// Get all files within a folder for a specific user
export async function getFilesInFolder(folderId: number, user_id: string): Promise<File[]> {
  try {
    return await prisma.file.findMany({
      where: {
        idParent: folderId,
        user_id: user_id, // Filter by user_id
      },
    });
  } catch (error) {
    console.error('Error fetching files in folder:', error);
    throw new Error('Failed to fetch files in folder');
  }
}

// Get a specific file by ID for a specific user
export async function getFileById(fileId: number, user_id: string): Promise<File | null> {
  try {
    return await prisma.file.findUnique({
      where: {
        id: fileId,
        user_id: user_id, // Filter by user_id
      },
    });
  } catch (error) {
    console.error('Error fetching file by ID:', error);
    throw new Error('Failed to fetch file by ID');
  }
}

// Create a new file
export async function createFile(name: string, extension: string, idParent: number, size: number, statut: string, user_id: string): Promise<File> {
  try {
    if (idParent == -1) {
        return await prisma.file.create({
            data: {
              name,
              extension,
              size,
              statut,
              isFolder: false,
              user_id: user_id, // Set user_id
            },
          });
    }
    return await prisma.file.create({
        data: {
          name,
          extension,
          idParent,
          size,
          statut,
          isFolder: false,
          user_id: user_id, // Set user_id
        },
      });
  } catch (error) {
    console.error('Error creating file:', error);
    throw new Error('Failed to create file');
  }
}

// Create a new folder
export async function createFolder(name: string, idParent: number, statut: string, user_id: string): Promise<File> {
  try {
    if (idParent == -1) {
        return await prisma.file.create({
          data: {
            name,
            size: 0,
            statut,
            isFolder: true,
            user_id: user_id, // Set user_id
          },
    });}
    return await prisma.file.create({
      data: {
        name,
        idParent,
        size: 0,
        statut,
        isFolder: true,
        user_id: user_id, // Set user_id
      },
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }
}

// Rename a file or folder
export async function renameFile(fileId: number, newName: string): Promise<File> {
  try {
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

// Delete a file or folder
export async function deleteFile(fileId: number): Promise<File> {
  try {
    return await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  } catch (error) {
    console.error('Error deleting file/folder:', error);
    throw new Error('Failed to delete file/folder');
  }
}

// Change access level of a file or folder
export async function changeAccess(fileId: number, accessLevel: string): Promise<File> {
  try {
    return await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        statut: accessLevel,
      },
    });
  } catch (error) {
    console.error('Error changing access level:', error);
    throw new Error('Failed to change access level');
  }
}
