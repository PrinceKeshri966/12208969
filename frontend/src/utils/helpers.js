export const generateShortcode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateShortcode = (code) => /^[a-zA-Z0-9]{1,20}$/.test(code);
export const formatDateTime = (date) => new Date(date).toLocaleString();
export const getUserAgent = () => navigator.userAgent;
