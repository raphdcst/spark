import * as Cloudflare from '@alchemy.run/cloudflare';
import * as GitHub from '@alchemy.run/github';
import { Stack } from 'alchemy';
import * as Output from 'alchemy/Output';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

import App, { Sessions } from './infra/app';
import Database from './infra/db';

export default Stack(
	'Spark',
	{
		providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const app = yield* App;
		const db = yield* Database;
		const sessions = yield* Sessions;

		if (process.env.PULL_REQUEST) {
			yield* GitHub.Comment('preview-comment', {
				owner: 'raphdcst',
				repository: 'spark',
				issueNumber: Number(process.env.PULL_REQUEST),
				body: Output.interpolate`
              ## Preview Deployed

              **URL:** ${app.url}

              Built from commit ${process.env.GITHUB_SHA?.slice(0, 7)}

              ---
              _This comment updates automatically with each push._
            `,
			});
		}

		return {
			devUrl: app.url,
			appWorker: app.workerName,
			database: db.databaseName,
			sessionsNamespace: sessions.title,
		};
	}),
);
