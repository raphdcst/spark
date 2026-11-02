import { drizzle } from 'drizzle-orm/d1';

import type { Database } from '../types';
import * as schema from './schema';

export function getDb(binding: Database) {
	return drizzle(binding, { schema });
}
