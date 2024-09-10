import { useState, useEffect } from 'react';

export function useLocaleStorage(initialValue, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
