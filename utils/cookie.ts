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

//userSaveSeedDuration in days
export function setAddValue(value: string) {
    const keyCookie = useCookie('add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
    });
    keyCookie.value = value;
}