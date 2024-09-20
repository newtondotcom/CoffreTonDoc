import { defineEventHandler, readBody } from 'h3';
import { downloadFile, uploadFile } from '../data/s3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const base64File = body.file;

    await uploadFile(base64File, 'test');
    const file = await downloadFile('test');
    return file;
});
