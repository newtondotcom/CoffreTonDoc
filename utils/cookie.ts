/**
 * Retrieves the value of the 'add' cookie.
 * @returns {string | undefined} The value of the 'add' cookie if it exists, otherwise undefined.
 */
export function getAddValue() {
    const keyCookie = useCookie('add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
    });
    return keyCookie.value;
}

/**
 * Sets the value of the 'add' cookie.
 * @param {string} value - The value to set for the 'add' cookie.
 */
export function setAddValue(value: string) {
    const keyCookie = useCookie('add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
    });
    if (value === '') {
        keyCookie.value = undefined;
        return;
    }
    keyCookie.value = value;
}

/**
 * Retrieves the value of the 'hash-add' cookie.
 * @returns {string | undefined} The value of the 'hash-add' cookie if it exists, otherwise undefined.
 */
export function getHashAddValue() {
    const keyCookie = useCookie('hash-add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
    });
    return keyCookie.value;
}

/**
 * Sets the value of the 'hash-add' cookie.
 * @param {string} value - The value to set for the 'hash-add' cookie.
 */
export function setHashAddValue(value: string) {
    const keyCookie = useCookie('hash-add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
    });
    if (value === '') {
        keyCookie.value = undefined;
        return;
    }
    keyCookie.value = value;
}
