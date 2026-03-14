export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

type StorageLike = Pick<StorageAdapter, "getItem" | "setItem" | "removeItem">;

export interface CookieStorageAdapterOptions {
  getCookieString?: () => string;
  setCookieString?: (value: string) => void;
  path?: string;
  maxAgeSeconds?: number;
}

export function createMemoryStorageAdapter(
  initial: Record<string, string> = {},
): StorageAdapter {
  const store = new Map<string, string>(Object.entries(initial));

  return {
    getItem(key) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

export function createBrowserLocalStorageAdapter(
  storage?: StorageLike,
): StorageAdapter {
  const fallback = createMemoryStorageAdapter();
  const target = storage ?? resolveLocalStorage();

  if (!target) {
    return fallback;
  }

  return {
    getItem(key) {
      try {
        return target.getItem(key);
      } catch {
        return fallback.getItem(key);
      }
    },
    setItem(key, value) {
      try {
        target.setItem(key, value);
      } catch {
        fallback.setItem(key, value);
      }
    },
    removeItem(key) {
      try {
        target.removeItem(key);
      } catch {
        fallback.removeItem(key);
      }
    },
  };
}

export function createCookieStorageAdapter(
  options: CookieStorageAdapterOptions = {},
): StorageAdapter {
  const fallback = createMemoryStorageAdapter();

  const getCookieString = options.getCookieString ?? resolveCookieGetter();
  const setCookieString = options.setCookieString ?? resolveCookieSetter();

  if (!getCookieString || !setCookieString) {
    return fallback;
  }

  const path = options.path ?? "/";

  return {
    getItem(key) {
      const encodedKey = encodeURIComponent(key);
      const cookie = getCookieString();
      const pairs = cookie.split(";");

      for (const rawPair of pairs) {
        const pair = rawPair.trim();
        if (!pair) {
          continue;
        }

        const separator = pair.indexOf("=");
        if (separator < 0) {
          continue;
        }

        const pairKey = pair.slice(0, separator);
        if (pairKey !== encodedKey) {
          continue;
        }

        const value = pair.slice(separator + 1);
        if (value.length === 0) {
          return null;
        }

        return decodeURIComponent(value);
      }

      return null;
    },
    setItem(key, value) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      const maxAge = options.maxAgeSeconds ? `; Max-Age=${options.maxAgeSeconds}` : "";
      setCookieString(`${encodedKey}=${encodedValue}; Path=${path}${maxAge}`);
    },
    removeItem(key) {
      const encodedKey = encodeURIComponent(key);
      setCookieString(`${encodedKey}=; Max-Age=0; Path=${path}`);
    },
  };
}

function resolveLocalStorage(): StorageLike | undefined {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function resolveCookieGetter(): (() => string) | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  return () => document.cookie;
}

function resolveCookieSetter(): ((value: string) => void) | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  return (value: string) => {
    document.cookie = value;
  };
}
