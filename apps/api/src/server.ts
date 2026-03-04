import { buildApp } from './app.js';
import { loadConfig } from './config/env.js';

const config = loadConfig();

async function main() {
  const app = buildApp();
  await app.listen({ port: config.port, host: config.host });
}

void main();
