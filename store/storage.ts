const createStorage = () => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      getItem: (_key: string) => null,
      setItem: (_key: string, _value: any) => {},
      removeItem: (_key: string) => {},
    };
  }

  return {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
    removeItem: (key: string) => localStorage.removeItem(key),
  };
};

const storage = createStorage();

export default storage;
