import { createFolder, folderExists } from '~/server/data/files';
import errorCodes, { setFail } from '~/utils/codes';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const operation = getRouterParam(event, 'operation');
    switch (operation) {
        case 'create':
            return create(event);
        default:
            return setFail(event, errorCodes.method_not_allowed);
    }
});

export async function create(event: H3Event) {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name = body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const exists = await folderExists(name, idParent, user_id);
    if (exists) {
        return setFail(event, errorCodes.folder_already_exists);
    }
    const id = await createFolder(name, idParent, statut, user_id);
    event.res.statusCode = 200;
    return id.id;
}
