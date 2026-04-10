import { defineConfig } from 'astro/config';
import snapshot from '../../packages/astro-snapshot/src/index.ts';
import type { Config } from '../../packages/astro-snapshot/src/index.ts';
import { TEST_CASES } from '../test-cases/shared/index.ts';

const pages: Config['pages'] = {};

// Group fixture images by page to build the snapshot `pages` map
for (const { page, screenshotConfig } of Object.values(TEST_CASES)) {
	(pages[page] ??= []).push(screenshotConfig);
}

// https://astro.build/config
export default defineConfig({
	integrations: [
		snapshot({
			pages,
		}),
	],
});
