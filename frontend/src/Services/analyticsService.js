import { FrontendLogger } from '../../../logging-middleware';

export const getGeolocation = async () => {
  try {
    FrontendLogger.api.debug('Fetching geolocation data');
    
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const location = `${data.city}, ${data.region}, ${data.country}`;
    
    FrontendLogger.api.info(`Successfully retrieved geolocation: ${location}`);
    return location;
    
  } catch (error) {
    FrontendLogger.api.error(`Failed to get geolocation: ${error.message}`);
    return 'Unknown Location';
  }
};


export const getUserAgent = () => {
  const userAgent = navigator.userAgent;
  FrontendLogger.utils.debug(`Retrieved user agent: ${userAgent}`);
  return userAgent;
};

export const createClickData = async () => {
  try {
    FrontendLogger.api.debug('Creating click data object');
    
    const [location] = await Promise.all([
      getGeolocation()
    ]);
    
    const clickData = {
      timestamp: new Date().toISOString(),
      source: getUserAgent(),
      location: location
    };
    
    FrontendLogger.api.info('Successfully created click data object');
    return clickData;
    
  } catch (error) {
    FrontendLogger.api.error(`Failed to create click data: ${error.message}`);
    
    return {
      timestamp: new Date().toISOString(),
      source: getUserAgent(),
      location: 'Unknown Location'
    };
  }
};


export const recordClick = async (shortcode, shortenedUrls, updateUrls) => {
  try {
    FrontendLogger.api.info(`Recording click for shortcode: ${shortcode}`);
    
    const clickData = await createClickData();
    
    const updatedUrls = shortenedUrls.map(url => 
      url.shortcode === shortcode 
        ? { ...url, clicks: [...url.clicks, clickData] }
        : url
    );
    
    updateUrls(updatedUrls);
    
    FrontendLogger.api.info(`Successfully recorded click for shortcode: ${shortcode}`);
    
  } catch (error) {
    FrontendLogger.api.error(`Failed to record click for shortcode ${shortcode}: ${error.message}`);
  }
};


export const getAnalyticsSummary = (urlData) => {
  try {
    const totalClicks = urlData.clicks.length;
    const uniqueLocations = new Set(urlData.clicks.map(click => click.location)).size;
    const uniqueSources = new Set(urlData.clicks.map(click => click.source)).size;
    
    const lastClickTime = urlData.clicks.length > 0 
      ? urlData.clicks[urlData.clicks.length - 1].timestamp 
      : null;
    
    const summary = {
      totalClicks,
      uniqueLocations,
      uniqueSources,
      lastClickTime,
      isExpired: new Date() > new Date(urlData.expiryDate)
    };
    
    FrontendLogger.utils.debug(`Generated analytics summary for ${urlData.shortcode}: ${totalClicks} clicks`);
    return summary;
    
  } catch (error) {
    FrontendLogger.utils.error(`Failed to generate analytics summary: ${error.message}`);
    
    return {
      totalClicks: 0,
      uniqueLocations: 0,
      uniqueSources: 0,
      lastClickTime: null,
      isExpired: false
    };
  }
};

export const getTopLocations = (clicks, limit = 5) => {
  try {
    const locationCounts = clicks.reduce((acc, click) => {
      acc[click.location] = (acc[click.location] || 0) + 1;
      return acc;
    }, {});
    
    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([location, count]) => ({ location, count }));
    
    FrontendLogger.utils.debug(`Generated top ${limit} locations from ${clicks.length} clicks`);
    return sortedLocations;
    
  } catch (error) {
    FrontendLogger.utils.error(`Failed to get top locations: ${error.message}`);
    return [];
  }
};


export const getClickTrends = (clicks) => {
  try {
    const clicksByDate = clicks.reduce((acc, click) => {
      const date = new Date(click.timestamp).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    const trends = Object.entries(clicksByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));
    
    FrontendLogger.utils.debug(`Generated click trends for ${clicks.length} clicks across ${trends.length} days`);
    return trends;
    
  } catch (error) {
    FrontendLogger.utils.error(`Failed to get click trends: ${error.message}`);
    return [];
  }
};

export default {
  getGeolocation,
  getUserAgent,
  createClickData,
  recordClick,
  getAnalyticsSummary,
  getTopLocations,
  getClickTrends
};