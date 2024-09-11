import { useState } from "react";

export const useSessionStorage = (keyName, defaultValue) => {
  const [storedSessExp, setStoredSessExp] = useState(() => {
    try {
      const expirationDate = sessionStorage.getItem('sessionExpiration');
      if (expirationDate) {
        return JSON.parse(expirationDate);
      } else {
        sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  
  const setSessionExp = (newDate) => {
    try {
        sessionStorage.setItem(keyName, JSON.stringify(newDate));
    } catch (err) {
      console.log(err);
    }
    setStoredSessExp(newDate);
  };
  return [storedSessExp, setSessionExp];
};