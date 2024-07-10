import { Buffer } from 'buffer';
import { $fetch} from 'ofetch';

export default defineNuxtPlugin(() => {
    globalThis.Buffer = Buffer;
    globalThis.$fetch = $fetch;
});
