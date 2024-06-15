import { deleteFile} from "../../data/files";

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId =  body.fileId;
    await deleteFile(fileId, user_id);
    return "ok";
  })