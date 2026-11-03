import { D1 } from '@alchemy.run/cloudflare';

const Database = D1.Database('Database', {
	migrations: '../drizzle',
});

export type Database = typeof Database;

export default Database;
