import { defineConfig } from 'astro/config';
import process from 'node:process';
import snapshot from '../../packages/astro-snapshot/src/index.ts';
import type { Config } from '../../packages/astro-snapshot/src/index.ts';
import { IMAGES } from '../io.ts';

const pages: Config['pages'] = {};

// Group fixture images by page to build the snapshot `pages` map
for (const { page, screenshotConfig } of Object.values(IMAGES)) {
	(pages[page] ??= []).push(screenshotConfig);
}

// https://astro.build/config
export default defineConfig({
	integrations: [
		snapshot({
			pages,
			launchOptions: {
				// Required for running Chrome in CI
				args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
			},
		}),
	],
});
