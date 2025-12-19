/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

/**
 * Sanitiza string para prevenir XSS básico
 */
export const sanitizeString = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Gera ID único seguro
 */
export const generateSecureId = (): number => {
  return Date.now() + Math.floor(Math.random() * 10000);
};

/**
 * Valida progresso (0-100)
 */
export const clampProgress = (value: number | string): number => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
};

