import { resolve } from 'node:path';
import { describe, it } from '@std/testing/bdd';
import { FileAsserter, ImageAsserter } from './utils/assertions.ts';
import { cleanOutput, runAstroBuild } from './utils/setup.ts';
import { IMAGES, OUTPUT_DIR } from './io.ts';

const DIR_NAME = import.meta.dirname!;

const ABS_FIXTURE_PATH = resolve(DIR_NAME, 'fixture');
const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, OUTPUT_DIR);

await cleanOutput(ABS_OUTPUT_PATH);
await runAstroBuild(ABS_FIXTURE_PATH);

describe('astro-snapshot integration', () => {
	for (const [key, image] of Object.entries(IMAGES)) {
		const absolutePath = resolve(ABS_FIXTURE_PATH, image.screenshotConfig.outputPath);
		const { expected } = image;

		describe(key, () => {
			const file = new FileAsserter(absolutePath);
			const img = new ImageAsserter(absolutePath);

			it('exists and is non-empty', () => file.assertExists());
			it(`is a ${expected.format}`, () => img.assertFormat(expected.format));
			it(`is ${expected.width}px wide`, () => img.assertWidth(expected.width));
			it(`is ${expected.height}px tall`, () => img.assertHeight(expected.height));
			it('has correct dominant color', () => img.assertDominantColor(expected.color));
		});
	}
});
