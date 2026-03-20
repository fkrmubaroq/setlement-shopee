/**
 * Validate Instagram URL
 * Supports: instagram.com/p/, instagram.com/reel/, instagram.com/tv/
 */
const validateInstagramUrl = (url: string): { valid: true } | { valid: false; message: string } => {
  // Basic URL validation
  try {
    const urlObj = new URL(url);

    // Check if it's an Instagram domain
    const validDomains = ['instagram.com', 'www.instagram.com'];
    if (!validDomains.includes(urlObj.hostname)) {
      return { valid: false, message: 'URL harus dari domain instagram.com' };
    }

    // Check for valid Instagram video/post paths
    const validPaths = ['/p/', '/reel/', '/reels/', '/tv/'];
    const hasValidPath = validPaths.some(path => urlObj.pathname.includes(path));

    if (!hasValidPath) {
      return { valid: false, message: 'URL harus berupa link post, reel, atau video Instagram' };
    }

    return { valid: true };
  } catch {
    return { valid: false, message: 'Format URL tidak valid' };
  }
};

export default validateInstagramUrl;