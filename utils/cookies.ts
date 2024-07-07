export function getKeyValue() {
  const keyCookie = useCookie("key", {
    path: "/",
    secure: true, // Only send cookie over HTTPS
    httpOnly: false, // Allow JavaScript access to cookie
    sameSite: "strict", // Prevent CSRF attacks
    signed: true, // Sign cookie to verify integrity
  });
  return keyCookie.value;
}

//userSaveSeedDuration in days
export function setKeyValue(userSaveSeedDuration: number, value: string) {
  const keyCookie = useCookie("key", {
    maxAge: 60 * 60 * 24 * userSaveSeedDuration,
    path: "/",
    secure: true, // Only send cookie over HTTPS
    httpOnly: false, // Allow JavaScript access to cookie
    sameSite: "strict", // Prevent CSRF attacks
    signed: true, // Sign cookie to verify integrity
  });
  keyCookie.value = value;
}
