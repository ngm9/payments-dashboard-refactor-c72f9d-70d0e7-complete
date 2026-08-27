export const createLogger = (scope) => {
  const base = scope ? `[${scope}]` : '';

  const info = (message, meta) => {
    if (meta) {
      console.info(base, message, meta);
    } else {
      console.info(base, message);
    }
  };

  const error = (message, err) => {
    if (err) {
      console.error(base, message, err);
    } else {
      console.error(base, message);
    }
  };

  return { info, error };
};
