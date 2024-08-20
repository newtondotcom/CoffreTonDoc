import { createRecordFileToDelete, getFileById, getFilesInFolder } from '~/server/data/files';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';
import { renameFile } from '~/server/data/files';
import { H3Event } from 'h3';
import { deleteFile } from '~/server/data/s3';

export default defineEventHandler(async (event: H3Event) => {
    const operation = getRouterParam(event, 'operation');
    switch (operation) {
        case 'arborescence':
            return arborescence(event);
        case 'delete':
            return delete_(event);
        case 'rename':
            return rename(event);
        default:
            return setFail(event, errorCodes.method_not_allowed);
    }
});

async function arborescence(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const files = await getFilesInFolder(fileId, user_id);
    event.res.statusCode = 200;
    return files;
}

async function delete_(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const file = await getFileById(fileId, user_id);
    if (!file.isFolder) {
        await createRecordFileToDelete(fileId);
        const uname = file.file_name_on_s3;
        deleteFile(uname);
    }
    return setSuccess(event, errorCodes.success);
}

async function rename(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const newName = body.newName;
    await renameFile(fileId, newName, user_id);
    return setSuccess(event, errorCodes.success);
}
