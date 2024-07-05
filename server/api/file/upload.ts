import { createFile } from "~/server/data/files";
import {
  generateUniqueName,
  createPresignedUrlUpload,
} from "~/server/data/s3";

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
  const { url, objectName} = await createPresignedUrlUpload(uname);
  const idfinal = id.id;
  return { idfinal, url, objectName };
});
