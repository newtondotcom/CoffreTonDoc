import { getFilesInFolder } from '~/server/data/files';
import errorCodes from '~/utils/codes';
import { deleteFile, renameFile } from '~/server/data/files';

export default defineEventHandler(async (event) => {
    const operation = getRouterParam(event, 'operation');
    switch (operation) {
        case 'arborescence':
            return arborescence(event);
        case 'delete':
            return delete_(event);
        case 'rename':
            return rename(event);
        default:
            return errorCodes.method_not_allowed;
    }
});

async function arborescence(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const files = await getFilesInFolder(fileId, user_id);
    return files;
}

async function delete_(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    await deleteFile(fileId, user_id);
    return 'ok';
}

async function rename(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const newName = body.newName;
    await renameFile(fileId, newName, user_id);
    return 'ok';
}