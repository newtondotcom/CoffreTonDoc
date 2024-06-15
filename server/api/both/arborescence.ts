import { getFilesInFolder} from "../../data/files";

export default defineEventHandler(async (event) => {
    const user_id = event.context.user_id;
    const body = await readBody(event);
    const fileId =  body.fileId;
    const files = await getFilesInFolder(fileId, user_id);
    return files;
  })