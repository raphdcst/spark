import * as Cloudflare from '@alchemy.run/cloudflare';
import * as GitHub from '@alchemy.run/github';
import { Stack } from 'alchemy';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Redacted from 'effect/Redacted';

export default Stack(
	'github',
	{
		providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment;

		const apiToken = yield* Cloudflare.ApiToken.AccountApiToken('CIToken', {
			accountId,
			policies: [
				{
					effect: 'allow',
					permissionGroups: [
						'Secrets Store Write',
						'Workers Scripts Write',
						'Workers KV Storage Write',
						'D1 Write',
						'Queues Write',
						'Pages Write',
						'Account Settings Write',
						'Workers Tail Read',
					],
					resources: {
						[`com.cloudflare.api.account.${accountId}`]: '*',
					},
				},
			],
		});

		yield* GitHub.Secret('cf-api-token', {
			owner: 'raphdcst',
			repository: 'spark',
			name: 'CLOUDFLARE_API_TOKEN',
			value: apiToken.value,
		});

		yield* GitHub.Secret('cf-account-id', {
			owner: 'raphdcst',
			repository: 'spark',
			name: 'CLOUDFLARE_ACCOUNT_ID',
			value: Redacted.make(accountId),
		});
	}),
);
