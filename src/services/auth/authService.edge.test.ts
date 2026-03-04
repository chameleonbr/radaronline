import { describe, expect, it } from 'vitest';

import { mapCreateUserErrorMessage } from './authService.edge';

describe('authService.edge', () => {
  it('maps duplicated provider errors to user-facing messages', () => {
    expect(mapCreateUserErrorMessage('already registered')).toBe('Este email ja esta cadastrado');
    expect(mapCreateUserErrorMessage('password too weak')).toBe(
      'Senha muito fraca. Use pelo menos 6 caracteres'
    );
    expect(mapCreateUserErrorMessage('Role invalido')).toBe('Nivel de acesso invalido');
  });
});
