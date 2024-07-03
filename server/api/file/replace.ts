import { replaceFile } from "~/server/data/files";
import {
  generateUniqueName,
  createPresignedUrlDownload,
} from "~/server/data/s3";

export default defineEventHandler(async (event) => {
  const user_id = event.context.user_id;
  const body = await readBody(event);
  const fileId = body.fileId;
  const uname = generateUniqueName();
  const urlUpload = await createPresignedUrlDownload(user_id, uname);
  const id = await replaceFile(user_id, fileId, uname);
  const idfinal = id.id;
  return { idfinal, urlUpload };
});
