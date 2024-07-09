import { createFolder, folderExists } from '~/server/data/files';
import errorCodes from "~/utils/codes"

export default defineEventHandler(async (event) => {
  const user_id = event.context.user_id;
  const body = await readBody(event);
  const name = body.name;
  const idParent = body.idParent;
  const statut = body.statut;
  const exists = await folderExists(name, idParent, user_id);
  if (exists) {
    return errorCodes.folder_already_exists;
  }
  const id = await createFolder(name, idParent, statut, user_id);
  return id.id;
});
