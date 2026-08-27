export const createCache = (namespace) => {
  const memory = new Map();

  const buildKey = (key) => `${namespace}::${key}`;

  const get = (key) => {
    const memoryEntry = memory.get(key);
    if (memoryEntry) {
      return memoryEntry.value;
    }

    try {
      const raw = window.localStorage.getItem(buildKey(key));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.value;
    } catch (error) {
      return null;
    }
  };

  const set = (key, value) => {
    memory.set(key, { value });
    try {
      const payload = { value };
      window.localStorage.setItem(buildKey(key), JSON.stringify(payload));
    } catch (error) {
      // Ignore storage failures
    }
  };

  const clear = (key) => {
    memory.delete(key);
    try {
      window.localStorage.removeItem(buildKey(key));
    } catch (error) {
      // Ignore storage failures
    }
  };

  return { get, set, clear };
};
