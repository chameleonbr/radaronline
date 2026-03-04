# ADR 0001 - Centralizar Acesso Ao Provider Em `platformClient`

## Status

Accepted

## Contexto

O frontend acessava o provider atual de forma espalhada, o que aumentava:

- lock-in
- dificuldade de teste
- dificuldade de migracao incremental
- risco de regressao em auth e realtime

## Decisao

Centralizar o acesso ao cliente concreto em:

- `src/services/platformClient.ts`

E fazer servicos consumirem esse seam em vez de importar o cliente concreto diretamente.

## Consequencias positivas

- reduz acoplamento direto ao provider
- facilita testes por configuracao de client alternativo
- cria ponto unico para futura troca de adapter

## Consequencias negativas

- ainda nao elimina lock-in funcional
- o tipo do seam continua refletindo capacidades do provider atual
- auth, realtime e edge functions seguem acoplados conceitualmente

## Proximos passos necessarios

- separar interfaces por capability
- criar adapters neutros para auth, data e realtime
- reduzir dependencia de schema concreto nos servicos
