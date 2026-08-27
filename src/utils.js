export const shallowClone = (value) => {
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (value && typeof value === 'object') {
    return { ...value };
  }
  return value;
};

export const formatCurrency = (amount, currency = 'INR') => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return '-';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatInteger = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(value);
};

export const safeText = (text) => {
  if (text == null) return '';
  return String(text);
};
