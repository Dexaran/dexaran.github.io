/**
 * This module is a wrapper around local/session storage, allowing to persist
 * an arbitrary objects in local browser.
 */

// Ensures the localStorage gracefully fails in Node and in browsers that do
// not support localStorage/sessionStorage.
const noStorage = () => typeof window === "undefined" || !window.localStorage;

export const storeData = (key: string, value: any) => {
  if (noStorage()) {
    return false;
  }

  try {
    const item = {
      time: Date.now(),
      value,
    };

    window.localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (ex) {
    return false;
  }
};

export const getData = (key: any) => {
  if (noStorage()) {
    return null;
  }

  const itemStr = window.localStorage.getItem(key);
  try {
    const item = JSON.parse(itemStr);
    return item.value;
  } catch (ex) {
    return null;
  }
};
