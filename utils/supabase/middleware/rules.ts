export const isPublic = (pathname: string) => {
    if (pathname === "/") return true;
    if (pathname === "/favicon.ico") return true;
    if (pathname.startsWith("/auth")) return true;

    return false;
};

export const BLOCKED_REDIRECT = "/";
