import { renameFile} from "../../data/files";

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId =  body.fileId;
    const newName = body.newName;
    await renameFile(fileId, newName, user_id);
    return "ok";
  })