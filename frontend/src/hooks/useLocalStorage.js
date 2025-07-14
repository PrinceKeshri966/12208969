import { useState } from 'react';
import { FrontendLogger } from '../../../logging-middleware';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      FrontendLogger.hook.error(`Failed to read localStorage: ${error.message}`);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      FrontendLogger.hook.error(`Failed to write localStorage: ${error.message}`);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
