# Observability

## Estado atual

O frontend agora possui uma trilha basica de observabilidade local para erros e eventos relevantes.

Arquivos principais:

- `src/lib/observability.ts`
- `src/lib/logger.ts`
- `src/components/app/ObservabilityBootstrap.tsx`
- `src/components/common/ErrorBoundary.tsx`

## O que foi implementado

- captura estruturada de `error`, `warn` e `info`
- buffer local em `sessionStorage`
- captura de:
  - `window.error`
  - `window.unhandledrejection`
  - `ErrorBoundary`
- contexto de usuario anexado quando autenticado
- envio opcional de erros via `sendBeacon` se `VITE_OBSERVABILITY_BEACON_URL` estiver configurada

## Limites atuais

- nao ha backend proprio de observabilidade
- nao existem dashboards nem alertas automatizados
- o buffer local serve para diagnostico e troubleshooting, nao para retenção longa

## Uso operacional

### Habilitar encaminhamento externo

Definir:

- `VITE_OBSERVABILITY_BEACON_URL`

O endpoint deve aceitar `application/json` com eventos estruturados.

### O que validar

- erro em componente React cai no `ErrorBoundary`
- promise rejeitada sem catch gera evento de `unhandledrejection`
- erro global de browser gera evento de `window.error`

## Evolucao recomendada

- integrar com backend/collector central
- adicionar correlation id por sessao/request
- expor painéis e alertas por severidade
