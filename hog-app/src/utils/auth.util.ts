export const isExcludedUrl = (url: string): boolean => {
    return url.includes("/auth/");
};

export const hasTokenExpired = (exp: string) => {
    const currentTimestamp = Date.now() / 1000; // convert to seconds
    const expTimestamp = Date.parse(exp) / 1000;
    const willExpireSoon = expTimestamp - currentTimestamp <= 60;
    return willExpireSoon;
};
