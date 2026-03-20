import { defineConfig } from 'astro/config';
import { join } from 'node:path';
import process from 'node:process';
import snapshot from '../../src/index.ts';
import { OUTPUT_DIR_NAME, OUTPUT_IMAGE_NAME } from '../constants.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/': [
					{
						outputPath: join(OUTPUT_DIR_NAME, OUTPUT_IMAGE_NAME),
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
