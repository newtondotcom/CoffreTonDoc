import { createFile } from "../../data/files";
import { generateUniqueName, createPresignedUrlDownload } from "../../data/s3";

export default defineEventHandler(async (event) => {
  const user_id = event.context.user_id;
  const body = await readBody(event);
  const name = body.name;
  const idParent = body.idParent;
  const statut = body.statut;
  const size = body.size;
  const extension = body.extension;
  const id = await createFile(name, extension, idParent, size, statut, user_id);
  const uname = generateUniqueName();
  const urlUpload = await createPresignedUrlDownload(user_id, uname);
  const idfinal = id.id;
  return { idfinal, urlUpload };
});
