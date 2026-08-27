export const createEventBus = () => {
  const listeners = new Map();

  const on = (eventName, handler) => {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, []);
    }
    const handlers = listeners.get(eventName);
    handlers.push(handler);
  };

  const off = (eventName, handler) => {
    const handlers = listeners.get(eventName);
    if (!handlers) return;
    const index = handlers.indexOf(handler);
    if (index >= 0) {
      handlers.splice(index, 1);
    }
  };

  const emit = (eventName, payload) => {
    const handlers = listeners.get(eventName);
    if (!handlers || handlers.length === 0) return;
    const snapshot = handlers.slice();
    for (const handler of snapshot) {
      try {
        handler(payload);
      } catch (error) {
        // Intentionally not rethrowing to avoid breaking other listeners
        // Logging should be handled by a logger passed into handlers or modules
        console.error('Error in event handler for', eventName, error);
      }
    }
  };

  return { on, off, emit };
};
