import errorCodes, { setFail, setSuccess } from '~/utils/codes';
import { createFile, fileExists, getFileById, replaceFile } from '~/server/data/files';
import { downloadFile, generateUniqueName, uploadFile } from '~/server/data/s3';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const operation = getRouterParam(event, 'operation');
    try {
        switch (operation) {
            case 'create':
                return create(event);
            case 'preview':
                return preview(event);
            case 'replace':
                return replace(event);
            case 'upload':
                return upload(event);
            case 'download':
                return download(event);
            default:
                return setFail(event, errorCodes.method_not_allowed);
        }
    } catch (e) {
        setFail(event, errorCodes.internal_server_error);
    }
});

async function create(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const exists = await fileExists(name, extension, idParent, user_id);
    if (exists) {
        return setFail(event, errorCodes.file_already_exists);
    }
    const uname = generateUniqueName();
    const id = await createFile(name, extension, idParent, size, statut, user_id, uname);
    return setSuccess(event, id.toString());
}

async function preview(event: H3Event) {
    const user_id = event.context.user_id;
    // check for ownership
    const body = await readBody(event);
    const name_s3 = body.name_s3;
    const file = await downloadFile(name_s3);
    return setSuccess(event, file);
}

async function replace(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = parseInt(body.fileId);
    const size = body.size;
    const file = body.file;
    const ref = await getFileById(fileId, user_id);
    const uname: string = ref?.file_name_on_s3 || generateUniqueName();
    await uploadFile(file, uname);
    await replaceFile(user_id, fileId, size, uname);
    return setSuccess(event, fileId);
}

async function upload(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const file = body.file;
    const uname = generateUniqueName();
    const id = await createFile(name, extension, idParent, size, statut, user_id, uname);
    await uploadFile(file, uname);
    setResponseStatus(event, 200);
    return { id: id.toString(), name_in_s3: uname };
}

async function download(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = parseInt(body.fileId);
    const ref = await getFileById(fileId, user_id);
    const name_s3 = ref?.file_name_on_s3 || '';
    const file = await downloadFile(name_s3);
    setResponseStatus(event, 200);
    return file;
}
