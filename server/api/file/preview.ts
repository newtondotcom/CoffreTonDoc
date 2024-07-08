import { createPresignedUrlDownload } from '~/server/data/s3';

export default defineEventHandler(async (event) => {
  const user_id = event.context.user_id;
  const body = await readBody(event);
  const name_s3 = body.name_s3;
  // log file access
  const url = await createPresignedUrlDownload(name_s3);
  return { url };
});
