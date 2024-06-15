import { createFile} from "../../data/files";

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const name =  body.name;
    const idParent = body.idParent;
    const statut = body.statut;
    const size = body.size;
    const extension = body.extension;
    const id = await createFile(name, extension, idParent, size, statut, user_id);
    return id.id;
})