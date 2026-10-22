export const formatDate = (value, options = {}) => {
  if (!value) return '–';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '–';
  const { locale = 'en-IN', ...dateOptions } = options;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', ...dateOptions }).format(date);
};

export const daysRemaining = (value, now = new Date()) => {
  if (!value) return null;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end - start) / 86400000);
};

export const isPastDate = (value, now = new Date()) => {
  const remaining = daysRemaining(value, now);
  return remaining !== null && remaining < 0;
};

export const toDateInputValue = value => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};
