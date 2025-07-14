import { FrontendLogger } from '../../../logging-middleware';

export const getGeolocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return `${data.city}, ${data.region}, ${data.country}`;
  } catch (error) {
    FrontendLogger.utils.error(`Geolocation failed: ${error.message}`);
    return 'Unknown Location';
  }
};
