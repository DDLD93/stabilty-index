const STORAGE_KEY = "nsi_device_id";

/**
 * Returns a stable device identifier for the current browser.
 * Uses localStorage; call from client only (e.g. inside useEffect).
 * Returns null when not in a browser or localStorage is unavailable.
 */
export function getDeviceHash(): string | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}
