import assert from 'node:assert/strict';
import test from 'node:test';

import { buildApp } from './app.js';

test('GET /health returns service status', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    assert.equal(response.statusCode, 200);
    const payload = response.json();
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'radar-api');
    assert.ok(payload.timestamp);
  } finally {
    await app.close();
  }
});

test('GET /v1/auth/session returns anonymous session without auth headers', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/auth/session',
    });

    assert.equal(response.statusCode, 200);
    const payload = response.json();
    assert.equal(payload.authenticated, false);
    assert.ok(payload.traceId);
  } finally {
    await app.close();
  }
});

test('GET /v1/auth/profile returns authenticated profile in development mode', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/auth/profile',
      headers: {
        'x-dev-user-id': 'user-first-access',
        'x-dev-user-email': 'user@example.gov.br',
        'x-dev-user-name': 'Usuario Teste',
        'x-dev-user-role': 'usuario',
      },
    });

    assert.equal(response.statusCode, 200);
    const payload = response.json();
    assert.equal(payload.id, 'user-first-access');
    assert.equal(payload.email, 'user@example.gov.br');
    assert.equal(payload.role, 'usuario');
  } finally {
    await app.close();
  }
});

test('GET /v1/users returns in-memory users for admin dev headers', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/users',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
    });

    assert.equal(response.statusCode, 200);
    const payload = response.json();
    assert.ok(Array.isArray(payload.items));
  } finally {
    await app.close();
  }
});

test('POST /v1/users creates user in development mode with admin headers', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/users',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
      payload: {
        email: 'gestor@example.gov.br',
        password: '12345678',
        name: 'Gestor Teste',
        role: 'gestor',
        microregionId: 'MR001',
      },
    });

    assert.equal(response.statusCode, 201);
    const payload = response.json();
    assert.equal(payload.email, 'gestor@example.gov.br');
    assert.equal(payload.role, 'gestor');
    assert.equal(payload.microregionId, 'MR001');
  } finally {
    await app.close();
  }
});

test('POST /v1/auth/first-access/complete accepts self-service completion in development mode', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/first-access/complete',
      headers: {
        'x-dev-user-id': 'user-first-access',
        'x-dev-user-email': 'user@example.gov.br',
        'x-dev-user-name': 'Usuario Teste',
        'x-dev-user-role': 'usuario',
      },
      payload: {
        userId: 'user-first-access',
        userEmail: 'user@example.gov.br',
        municipio: 'Belo Horizonte',
        newPassword: '123456',
        microregionId: 'MR001',
      },
    });

    assert.equal(response.statusCode, 204);
  } finally {
    await app.close();
  }
});

test('POST /v1/tags creates and GET /v1/tags lists tags in development mode', async () => {
  const app = buildApp();
  try {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/v1/tags',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
      payload: {
        name: 'Governanca',
      },
    });

    assert.equal(createResponse.statusCode, 201);
    const created = createResponse.json();
    assert.equal(created.name, 'GOVERNANCA');

    const listResponse = await app.inject({
      method: 'GET',
      url: '/v1/tags?microregionId=MR001',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
    });

    assert.equal(listResponse.statusCode, 200);
    const payload = listResponse.json();
    assert.ok(Array.isArray(payload.items));
    assert.ok(payload.items.some((item: { name: string }) => item.name === 'GOVERNANCA'));
  } finally {
    await app.close();
  }
});

test('POST /v1/teams creates and GET /v1/teams lists members in development mode', async () => {
  const app = buildApp();
  try {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/v1/teams',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
      payload: {
        microregionId: 'MR001',
        name: 'Novo Colaborador',
        role: 'Membro',
        email: 'novo@example.gov.br',
        municipality: 'Belo Horizonte',
      },
    });

    assert.equal(createResponse.statusCode, 201);
    const created = createResponse.json();
    assert.equal(created.name, 'Novo Colaborador');
    assert.equal(created.microregionId, 'MR001');

    const listResponse = await app.inject({
      method: 'GET',
      url: '/v1/teams?microregionId=MR001',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
    });

    assert.equal(listResponse.statusCode, 200);
    const payload = listResponse.json();
    assert.ok(Array.isArray(payload.itemsByMicro.MR001));
    assert.ok(
      payload.itemsByMicro.MR001.some((item: { name: string }) => item.name === 'Novo Colaborador')
    );
  } finally {
    await app.close();
  }
});

test('POST /v1/objectives creates and GET /v1/activities returns grouped activities in development mode', async () => {
  const app = buildApp();
  try {
    const createObjectiveResponse = await app.inject({
      method: 'POST',
      url: '/v1/objectives',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
      payload: {
        title: 'Objetivo API',
        microregionId: 'MR001',
      },
    });

    assert.equal(createObjectiveResponse.statusCode, 201);
    const objective = createObjectiveResponse.json();

    const createActivityResponse = await app.inject({
      method: 'POST',
      url: '/v1/activities',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
      payload: {
        objectiveId: objective.id,
        id: `${objective.id}.1`,
        title: 'Atividade API',
        microregionId: 'MR001',
        description: 'Descricao',
      },
    });

    assert.equal(createActivityResponse.statusCode, 201);

    const listActivitiesResponse = await app.inject({
      method: 'GET',
      url: '/v1/activities?microregionId=MR001',
      headers: {
        'x-dev-user-id': 'seed-admin',
        'x-dev-user-email': 'admin@example.gov.br',
        'x-dev-user-name': 'Administrador',
        'x-dev-user-role': 'admin',
      },
    });

    assert.equal(listActivitiesResponse.statusCode, 200);
    const payload = listActivitiesResponse.json();
    assert.ok(Array.isArray(payload.itemsByObjective[String(objective.id)]));
    assert.ok(
      payload.itemsByObjective[String(objective.id)].some(
        (item: { title: string }) => item.title === 'Atividade API'
      )
    );
  } finally {
    await app.close();
  }
});
