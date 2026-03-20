/**
 * Cookie utility functions with environment-based prefix
 */

// Get cookie prefix based on environment
const getCookiePrefix = (): string => {
    const env = import.meta.env.MODE || 'development';
    const prefixMap: Record<string, string> = {
        production: 'prod_',
        staging: 'stg_',
        development: 'dev_',
    };
    return prefixMap[env] || 'dev_';
};

// Cookie prefix
const COOKIE_PREFIX = getCookiePrefix();

export interface CookieOptions {
    /** Number of days until the cookie expires */
    expires?: number;
    /** Cookie path */
    path?: string;
    /** Cookie domain */
    domain?: string;
    /** Secure flag - only send over HTTPS */
    secure?: boolean;
    /** SameSite attribute */
    sameSite?: 'strict' | 'lax' | 'none';
    /** HttpOnly flag - not accessible via JavaScript (only works when set by server) */
    httpOnly?: boolean;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name (without prefix)
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
    const prefixedName = `${COOKIE_PREFIX}${name}`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === prefixedName) {
            try {
                return decodeURIComponent(cookieValue);
            } catch {
                return cookieValue;
            }
        }
    }

    return null;
}

/**
 * Set a cookie with the given name and value
 * @param name - Cookie name (without prefix)
 * @param value - Cookie value
 * @param options - Cookie options
 */
export function setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
): void {
    const prefixedName = `${COOKIE_PREFIX}${name}`;

    const {
        expires = 7, // Default: 7 days
        path = '/',
        domain,
        secure = import.meta.env.PROD, // Secure by default in production
        sameSite = 'lax',
    } = options;

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expires * 24 * 60 * 60 * 1000);

    // Build cookie string
    let cookieString = `${prefixedName}=${encodeURIComponent(value)}`;
    cookieString += `; expires=${expirationDate.toUTCString()}`;
    cookieString += `; path=${path}`;

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    if (secure) {
        cookieString += '; secure';
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
}

/**
 * Remove a cookie by name
 * @param name - Cookie name (without prefix)
 * @param options - Cookie options (path and domain should match the original cookie)
 */
export function removeCookie(
    name: string,
    options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
    const prefixedName = `${COOKIE_PREFIX}${name}`;

    const { path = '/', domain } = options;

    // Set expiration to past date to delete the cookie
    let cookieString = `${prefixedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    cookieString += `; path=${path}`;

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
}

/**
 * Check if a cookie exists
 * @param name - Cookie name (without prefix)
 * @returns true if cookie exists
 */
export function hasCookie(name: string): boolean {
    return getCookie(name) !== null;
}

/**
 * Get all cookies with the current environment prefix
 * @returns Object with all prefixed cookies
 */
export function getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');

    for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name.startsWith(COOKIE_PREFIX)) {
            const unprefixedName = name.slice(COOKIE_PREFIX.length);
            try {
                cookies[unprefixedName] = decodeURIComponent(value);
            } catch {
                cookies[unprefixedName] = value;
            }
        }
    }

    return cookies;
}

/**
 * Clear all cookies with the current environment prefix
 * @param options - Cookie options (path and domain should match the original cookies)
 */
export function clearAllCookies(
    options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
    const cookies = getAllCookies();
    for (const name of Object.keys(cookies)) {
        removeCookie(name, options);
    }
}

// Export the prefix for debugging purposes
export const cookiePrefix = COOKIE_PREFIX;

