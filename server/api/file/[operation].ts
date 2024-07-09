import errorCodes from '~/utils/codes';
import { createFile, fileExists, replaceFile } from '~/server/data/files';
import {
    createPresignedUrlDownload,
    createPresignedUrlUpload,
    generateUniqueName,
} from '~/server/data/s3';

export default defineEventHandler(async (event) => {
    const operation = getRouterParam(event, 'operation');
    switch (operation) {
        case 'create':
            return create(event);
        case 'preview':
            return preview(event);
        case 'replace':
            return replace(event);
        case 'upload':
            return upload(event);
        default:
            return errorCodes.method_not_allowed;
    }
});

async function create(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const exists = await fileExists(name, extension, idParent, user_id);
    if (exists) {
        return errorCodes.file_already_exists;
    }
    const id = await createFile(
        name,
        extension,
        idParent,
        size,
        statut,
        user_id,
    );
    return id.id;
}

async function preview(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name_s3 = body.name_s3;
    // log file access
    const url = await createPresignedUrlDownload(name_s3);
    return { url };
}

async function replace(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId = body.fileId;
    const uname = generateUniqueName();
    const urlUpload = await createPresignedUrlDownload(user_id, uname);
    const id = await replaceFile(user_id, fileId, uname);
    const idfinal = id.id;
    return { idfinal, urlUpload };
}

async function upload(event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const id = await createFile(
        name,
        extension,
        idParent,
        size,
        statut,
        user_id,
    );
    const uname = generateUniqueName();
    const { url, objectName } = await createPresignedUrlUpload(uname);
    const idfinal = id.id;
    return { idfinal, url, objectName };
}
