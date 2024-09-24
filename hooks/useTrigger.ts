const store: Map<string, (_?: unknown) => void | Promise<void>> = new Map();

export const setTrigger = (
  key: string,
  callback: (_params?: unknown) => void | Promise<void>
) => {
  store.set(key, callback);
};

export const updateTrigger = (
  _key: string,
  callback: (_obj?: { [key: string]: unknown }) => void | Promise<void>
) => store.set(_key, callback);

export const deleteTrigger = (key: string) => store.delete(key);

export default function runTrigger(key: string) {
  return store.get(key);
}
