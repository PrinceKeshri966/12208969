const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const Log = async (stack, level, packageName, message) => {
  try {
    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stack, level, package: packageName, message })
    });
    return response.ok ? await response.json() : null;
  } catch (err) {
    console.error('Logging failed:', err);
    return null;
  }
};

export const FrontendLogger = ['api', 'component', 'hook', 'page', 'state', 'utils'].reduce((acc, section) => {
  acc[section] = ['debug', 'info', 'warn', 'error', 'fatal'].reduce((obj, level) => {
    obj[level] = (msg) => Log('frontend', level, section, msg);
    return obj;
  }, {});
  return acc;
}, {});