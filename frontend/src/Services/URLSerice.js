
import { FrontendLogger } from './loggingService';
import { validateUniqueShortcode } from './validationService';

export const generateShortcode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  FrontendLogger.utils.debug(`Generated shortcode: ${result}`);
  return result;
};


export const generateUniqueShortcode = (preferredShortcode, urlMappings, shortenedUrls) => {
  let shortcode = preferredShortcode;
  
  if (!shortcode) {
    
    do {
      shortcode = generateShortcode();
    } while (!validateUniqueShortcode(shortcode, urlMappings, shortenedUrls));
    
    FrontendLogger.utils.info(`Generated unique shortcode: ${shortcode}`);
  } else {
    if (!validateUniqueShortcode(shortcode, urlMappings, shortenedUrls)) {
      FrontendLogger.utils.error(`Preferred shortcode already exists: ${shortcode}`);
      throw new Error('Shortcode already exists');
    }
    
    FrontendLogger.utils.info(`Using preferred shortcode: ${shortcode}`);
  }
  
  return shortcode;
};


export const createShortenedUrl = (urlData, urlMappings, shortenedUrls) => {
  try {
    const shortcode = generateUniqueShortcode(
      urlData.customShortcode, 
      urlMappings, 
      shortenedUrls
    );
    
    const now = new Date();
    const expiryDate = new Date(now.getTime() + urlData.validity * 60000);
    const shortUrl = `http://localhost:3000/${shortcode}`;
    
    const result = {
      shortcode,
      originalUrl: urlData.originalUrl,
      shortUrl,
      createdAt: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      clicks: [],
      validity: urlData.validity
    };
    
    FrontendLogger.api.info(`Successfully created shortened URL: ${shortcode} -> ${urlData.originalUrl}`);
    return result;
    
  } catch (error) {
    FrontendLogger.api.error(`Failed to create shortened URL: ${error.message}`);
    throw error;
  }
};


export const isUrlExpired = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const expired = now > expiry;
  
  if (expired) {
    FrontendLogger.utils.warn(`URL has expired: ${expiryDate}`);
  }
  
  return expired;
};


export const processBatchUrls = (urls, urlMappings, shortenedUrls) => {
  const results = [];
  const errors = [];
  
  FrontendLogger.api.info(`Processing batch of ${urls.length} URLs for shortening`);
  
  for (const url of urls) {
    try {
      const result = createShortenedUrl(url, urlMappings, shortenedUrls);
      results.push(result);
    } catch (error) {
      errors.push({ url: url.originalUrl, error: error.message });
      FrontendLogger.api.error(`Failed to process URL ${url.originalUrl}: ${error.message}`);
    }
  }
  
  if (errors.length > 0) {
    FrontendLogger.api.warn(`Batch processing completed with ${errors.length} errors`);
  } else {
    FrontendLogger.api.info(`Batch processing completed successfully: ${results.length} URLs shortened`);
  }
  
  return { results, errors };
};

export default {
  generateShortcode,
  generateUniqueShortcode,
  createShortenedUrl,
  isUrlExpired,
  processBatchUrls
};