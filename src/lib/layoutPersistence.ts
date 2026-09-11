const COPY_STORAGE_KEY = "futurefabric-copy";
const DIALKIT_STORAGE_PREFIX = "dialkit:";
const ORDER_STORAGE_PREFIX = "futurefabric-order:";

interface LayoutPayload {
  version: 1;
  storage: Record<string, string>;
}

function collectStorage() {
  const storage: Record<string, string> = {};

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || (key !== COPY_STORAGE_KEY && !key.startsWith(DIALKIT_STORAGE_PREFIX) && !key.startsWith(ORDER_STORAGE_PREFIX))) continue;
    const value = window.localStorage.getItem(key);
    if (value !== null) storage[key] = value;
  }

  return storage;
}

export async function hydrateSharedLayout() {
  try {
    const response = await fetch("/api/layout", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as Partial<LayoutPayload>;
    if (payload.version !== 1 || !payload.storage) return;

    for (const [key, value] of Object.entries(payload.storage)) {
      if (key === COPY_STORAGE_KEY || key.startsWith(DIALKIT_STORAGE_PREFIX) || key.startsWith(ORDER_STORAGE_PREFIX)) {
        window.localStorage.setItem(key, value);
      }
    }
  } catch {
    // Keep the local DialKit state when shared storage is unavailable.
  }
}

let saveTimer: number | undefined;

export function scheduleSharedLayoutSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    void saveSharedLayout();
  }, 400);
}

export async function saveSharedLayout() {
  try {
    const payload: LayoutPayload = { version: 1, storage: collectStorage() };
    await fetch("/api/layout", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Local persistence remains available when the shared save is unavailable.
  }
}
