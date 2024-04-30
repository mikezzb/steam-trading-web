// abstraction for localStorage

export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export function getItem(key: string, parse: boolean = false): any {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return parse ? JSON.parse(value) : value;
  } catch (e) {
    return null;
  }
}

export function setItem(
  key: string,
  value: any,
  stringify: boolean = false
): boolean {
  try {
    localStorage.setItem(key, stringify ? JSON.stringify(value) : value);
    return true;
  } catch (e) {
    return false;
  }
}

export function clear(): void {
  localStorage.clear();
}

export const Storage = {
  removeItem,
  getItem,
  setItem,
  clear,
};
