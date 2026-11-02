import { drizzle } from 'drizzle-orm/d1';

import type { Database } from '../types';

export function getDb(binding: Database) {
	return drizzle(binding);
}
