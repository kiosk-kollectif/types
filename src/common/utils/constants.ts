import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export const PUBLIC_DIR = path.join(__dirname, '../public');

if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR);
}

export const OPENAPI_FILE = path.join(PUBLIC_DIR, 'openapi.json');

export const JWT_TOKEN_EXPIRATION = '30d';

export const INVALIDE_TOKEN_DECORATOR_KEY = 'invalide_tokens';
