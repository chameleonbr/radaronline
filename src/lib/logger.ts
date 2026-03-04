// =====================================
// LOGGER PADRONIZADO
// =====================================
// Utilitário para logs consistentes com timestamps
// Facilita debug e integração futura com ferramentas de monitoramento

// Semgrep-safe: Usamos %s como format specifier fixo para evitar
// vulnerabilidades de format string (CWE-134)

import { captureException, captureLog } from './observability';

export const log = (component: string, message: string, data?: unknown): void => {
  captureLog('info', component, message, data);
};

export const logError = (component: string, message: string, error?: unknown): void => {
  if (error !== undefined) {
    captureException(component, error, { message });
    return;
  }

  captureLog('error', component, message);
};

export const logWarn = (component: string, message: string, data?: unknown): void => {
  captureLog('warn', component, message, data);
};



