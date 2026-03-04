import { describe, expect, it } from 'vitest';

import { buildUserAuditChanges } from './authService.audit';

describe('authService.audit', () => {
  it('records only fields that actually changed', () => {
    const changes = buildUserAuditChanges(
      {
        nome: 'Ana',
        email: 'ana@example.com',
        role: 'gestor',
        microregiao_id: 'micro-1',
        ativo: true,
        lgpd_consentimento: false,
      },
      {
        nome: 'Ana Paula',
        email: 'ana@example.com',
        microregiaoId: 'micro-2',
        ativo: true,
        lgpdConsentimento: true,
      },
      {
        nome: 'Ana Paula',
        email: 'ana@example.com',
        role: 'gestor',
        microregiao_id: 'micro-2',
        ativo: true,
        lgpd_consentimento: true,
      }
    );

    expect(changes).toEqual([
      { field: 'nome', from: 'Ana', to: 'Ana Paula' },
      { field: 'microregiao', from: 'micro-1', to: 'micro-2' },
      { field: 'lgpd', from: false, to: true },
    ]);
  });
});
