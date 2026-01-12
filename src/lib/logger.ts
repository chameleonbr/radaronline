// =====================================
// LOGGER PADRONIZADO
// =====================================
// Utilitário para logs consistentes com timestamps
// Facilita debug e integração futura com ferramentas de monitoramento

// Semgrep-safe: Usamos %s como format specifier fixo para evitar
// vulnerabilidades de format string (CWE-134)

// ⚠️ SEGURANÇA: Logs são desabilitados em produção para não expor informações sensíveis
const IS_PRODUCTION = import.meta.env.PROD;
const IS_DEV = import.meta.env.DEV;

export const log = (component: string, message: string, data?: unknown): void => {
  // ✅ Logs normais só aparecem em desenvolvimento
  if (IS_PRODUCTION) return;
  
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    console.log('[%s] [%s] %s', timestamp, component, message, data);
  } else {
    console.log('[%s] [%s] %s', timestamp, component, message);
  }
};

export const logError = (component: string, message: string, error?: unknown): void => {
  // ⚠️ Erros são logados mesmo em produção, mas sem detalhes sensíveis
  const timestamp = new Date().toISOString();
  if (IS_DEV) {
    console.error('[%s] [%s] %s', timestamp, component, message, error ?? '');
  } else {
    // Em produção, log apenas a mensagem, não o objeto de erro completo
    console.error('[%s] [%s] %s', timestamp, component, message);
  }
};

export const logWarn = (component: string, message: string, data?: unknown): void => {
  // ✅ Warnings só aparecem em desenvolvimento
  if (IS_PRODUCTION) return;
  
  const timestamp = new Date().toISOString();
  console.warn('[%s] [%s] %s', timestamp, component, message, data ?? '');
};



