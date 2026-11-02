import * as Cloudflare from '@alchemy.run/cloudflare';
import * as Alchemy from 'alchemy';
import * as Effect from 'effect/Effect';

export const Sessions = Cloudflare.KV.Namespace('Sessions');
export const Database = Cloudflare.D1.Database('Database');

export const Website = Cloudflare.Website.Astro('Website', {
	env: {
		DB: Database,
		SESSION: Sessions,
	},
	dev: {
		port: 3000,
	},
});

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>;

export default Alchemy.Stack(
	'Spark',
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const site = yield* Website;
		const db = yield* Database;
		const sessions = yield* Sessions;

		return {
			devUrl: site.url,
			websiteWorker: site.workerName,
			databaseName: db.databaseName,
			sessionsKV: sessions.title,
		};
	}),
);
