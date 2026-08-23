// Loads the .env file that sits next to this file, no matter which folder
// the command was run from.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverFolder = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(serverFolder, '.env') });
