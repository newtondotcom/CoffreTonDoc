import errorCodes, { setFail } from '~/utils/codes';
import { createFile, fileExists, getFileById, replaceFile } from '~/server/data/files';
import {
    createPresignedUrlDownload,
    createPresignedUrlUpload,
    generateUniqueName,
} from '~/server/data/s3';
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
    event.res.statusCode = 200;
    return id.id;
}

async function preview(event: H3Event) {
    const user_id = event.context.user_id;
    // check for ownership
    const body = await readBody(event);
    const name_s3 = body.name_s3;
    const url = await createPresignedUrlDownload(name_s3);
    event.res.statusCode = 200;
    return { url };
}

async function replace(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const size = body.size;
    const file = await getFileById(fileId, user_id);
    const uname: string = file.file_name_on_s3;
    const urlUpload = await createPresignedUrlDownload(user_id, uname);
    const id = await replaceFile(user_id, fileId, uname, size);
    const idfinal = id.id;
    event.res.statusCode = 200;
    return { idfinal, urlUpload };
}

async function upload(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const uname = generateUniqueName();
    const url = await createPresignedUrlUpload(uname);
    const id = await createFile(name, extension, idParent, size, statut, user_id, uname);
    const idfinal = id.id;
    event.res.statusCode = 200;
    return { idfinal, url, uname };
}

async function download(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const file = await getFileById(fileId, user_id);
    const name_s3 = file?.file_name_on_s3;
    const link = await createPresignedUrlDownload(name_s3);
    event.res.statusCode = 200;
    return link;
}
