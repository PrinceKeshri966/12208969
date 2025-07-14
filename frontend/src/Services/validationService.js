import { FrontendLogger } from '../../../logging-middleware';

export const validateUrl = (url) => {
  try {
    new URL(url);
    FrontendLogger.utils.debug(`URL validation successful: ${url}`);
    return true;
  } catch (error) {
    FrontendLogger.utils.warn(`URL validation failed: ${url} - ${error.message}`);
    return false;
  }
};

export const validateShortcode = (shortcode) => {
  const regex = /^[a-zA-Z0-9]{1,20}$/;
  const isValid = regex.test(shortcode);
  
  if (!isValid) {
    FrontendLogger.utils.warn(`Shortcode validation failed: ${shortcode}`);
  } else {
    FrontendLogger.utils.debug(`Shortcode validation successful: ${shortcode}`);
  }
  
  return isValid;
};

export const validateValidity = (validity) => {
  const isValid = validity >= 1 && validity <= 525600;
  
  if (!isValid) {
    FrontendLogger.utils.warn(`Validity validation failed: ${validity} minutes`);
  } else {
    FrontendLogger.utils.debug(`Validity validation successful: ${validity} minutes`);
  }
  
  return isValid;
};

export const validateUrlForm = (urls) => {
  const validatedUrls = urls.map((url, index) => {
    const urlData = { ...url, error: '' };
    
    if (!url.originalUrl.trim()) {
      urlData.error = 'URL is required';
      FrontendLogger.utils.warn(`Form validation failed at index ${index}: URL is required`);
    } else if (!validateUrl(url.originalUrl)) {
      urlData.error = 'Invalid URL format';
      FrontendLogger.utils.warn(`Form validation failed at index ${index}: Invalid URL format`);
    } else if (url.customShortcode && !validateShortcode(url.customShortcode)) {
      urlData.error = 'Invalid shortcode format (alphanumeric, max 20 chars)';
      FrontendLogger.utils.warn(`Form validation failed at index ${index}: Invalid shortcode format`);
    } else if (!validateValidity(url.validity)) {
      urlData.error = 'Validity must be between 1 and 525600 minutes';
      FrontendLogger.utils.warn(`Form validation failed at index ${index}: Invalid validity period`);
    }
    
    return urlData;
  });
  
  const hasErrors = validatedUrls.some(url => url.error);
  
  if (hasErrors) {
    FrontendLogger.utils.error('Form validation failed - contains validation errors');
  } else {
    FrontendLogger.utils.info('Form validation successful - all inputs valid');
  }
  
  return {
    validatedUrls,
    isValid: !hasErrors
  };
};


export const validateUniqueShortcode = (shortcode, urlMappings, shortenedUrls) => {
  const exists = urlMappings[shortcode] || shortenedUrls.some(url => url.shortcode === shortcode);
  
  if (exists) {
    FrontendLogger.utils.warn(`Shortcode uniqueness validation failed: ${shortcode} already exists`);
  } else {
    FrontendLogger.utils.debug(`Shortcode uniqueness validation successful: ${shortcode}`);
  }
  
  return !exists;
};

export default {
  validateUrl,
  validateShortcode,
  validateValidity,
  validateUrlForm,
  validateUniqueShortcode
};