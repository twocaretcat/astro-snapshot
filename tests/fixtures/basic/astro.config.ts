import { defineConfig } from 'astro/config';
import process from 'node:process';
import snapshot from '../../../src/index.ts';
import { OUTPUT_PATH } from '../../constants.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/': [
					{
						outputPath: `${OUTPUT_PATH}/index.png`,
					},
				],
			},
			launchOptions: {
				// Required for running Chrome in CI
				args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
			},
		}),
	],
});
