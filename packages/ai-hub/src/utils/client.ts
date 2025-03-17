export function isNodeEnv() {
    return typeof process !== 'undefined' && process.env !== undefined;
}

export function isBrowserEnv() {
    return typeof window !== 'undefined';
}

export function isMobileEnv() {
    return typeof navigator !== 'undefined' && /Mobile/i.test(navigator.userAgent);
}

