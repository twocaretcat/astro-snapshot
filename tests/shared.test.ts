import { resolve } from 'node:path';
import { describe, it } from '@std/testing/bdd';
import { FileAsserter, ImageAsserter } from './utils/assertions.ts';
import { cleanOutput, runAstroBuild } from './utils/setup.ts';
import { ABS_FIXTURE_PATH, OUTPUT_DIR } from './constants.ts';
import { highlight } from './utils/text.ts';
import { info } from 'node:console';
import { SHARED_TEST_CASE_MAP } from './test-cases/shared/index.ts';

const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, OUTPUT_DIR, 'shared');

await cleanOutput(ABS_OUTPUT_PATH);
await runAstroBuild(ABS_FIXTURE_PATH);

describe('astro-snapshot integration config', () => {
	for (const [key, testCase] of Object.entries(SHARED_TEST_CASE_MAP)) {
		const absolutePath = resolve(ABS_FIXTURE_PATH, testCase.screenshotConfig.outputPath);
		const { expected } = testCase;

		if (!expected) {
			info(highlight`🚫 No expected output defined for ${key}. Skipping assertions...`);
			continue;
		}

		describe(highlight`with ${key}`, () => {
			const file = new FileAsserter(absolutePath);
			const img = new ImageAsserter(absolutePath);

			it('image exists and is non-empty', () => file.assertExists());
			it(`image is a ${expected.format}`, () => img.assertFormat(expected.format));
			it(`image is ${expected.width}px wide`, () => img.assertWidth(expected.width));
			it(`image is ${expected.height}px tall`, () => img.assertHeight(expected.height));
			it('image has correct dominant color', () => img.assertDominantColor(expected.color));
		});
	}
});
