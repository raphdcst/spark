import { type InferEnv, KV, Website } from '@alchemy.run/cloudflare';

import Database from './db';

export const Sessions = KV.Namespace('Sessions');

const App = Website.Astro('App', {
	env: {
		DB: Database,
		SESSION: Sessions,
	},
	dev: {
		port: 3000,
	},
	access: {
		policies: [
			{
				decision: 'allow',
				include: [{ emailDomain: 'local.dev' }, { email: 'rdecostaire@gmail.com' }],
				sessionDuration: '12h',
			},
		],
	},
});

export type WebsiteEnv = InferEnv<typeof App>;

export default App;
