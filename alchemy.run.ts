import * as Cloudflare from '@alchemy.run/cloudflare';
import { Stack } from 'alchemy';
import * as Effect from 'effect/Effect';

import App, { Sessions } from './infra/app';
import Database from './infra/db';

export default Stack(
	'Spark',
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const app = yield* App;
		const db = yield* Database;
		const sessions = yield* Sessions;

		return {
			devUrl: app.url,
			appWorker: app.workerName,
			database: db.databaseName,
			sessionsNamespace: sessions.title,
		};
	}),
);
