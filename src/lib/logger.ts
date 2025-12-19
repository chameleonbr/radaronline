// =====================================
// LOGGER PADRONIZADO
// =====================================
// Utilitário para logs consistentes com timestamps
// Facilita debug e integração futura com ferramentas de monitoramento

export const log = (component: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] [${component}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] [${component}] ${message}`);
  }
};

export const logError = (component: string, message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${component}] ${message}`, error || '');
};

export const logWarn = (component: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [${component}] ${message}`, data || '');
};


