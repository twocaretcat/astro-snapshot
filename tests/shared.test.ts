import { resolve } from 'node:path';
import { beforeAll, describe, it } from '@std/testing/bdd';
import { FileAsserter, ImageAsserter } from './utils/assertions.ts';
import { cleanOutput, runAstroBuildWithScenario } from './utils/setup.ts';
import { ABS_FIXTURE_PATH, OUTPUT_DIR } from './constants.ts';
import { highlight } from './utils/text.ts';
import { info } from 'node:console';
import { SHARED_TEST_CASE_MAP } from './test-cases/shared/index.ts';

const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, OUTPUT_DIR, 'shared');

await cleanOutput(ABS_OUTPUT_PATH);
await runAstroBuildWithScenario('shared');

let file: FileAsserter;
let img: ImageAsserter;

describe('astro-snapshot integration config', () => {
	for (const [key, testCase] of Object.entries(SHARED_TEST_CASE_MAP)) {
		const outputPath = resolve(ABS_FIXTURE_PATH, testCase.screenshotConfig.outputPath);
		const { expected } = testCase;

		if (!expected) {
			info(highlight`🚫 No expected output defined for ${key}. Skipping assertions...`);
			continue;
		}

		describe(highlight`with ${key}`, () => {
			beforeAll(() => {
				file = new FileAsserter(outputPath);
				img = new ImageAsserter(outputPath);
			});

			const { format, width, height, color } = expected;

			it('image exists and is non-empty', () => file.assertExists());

			if (format) {
				it(`image is a ${format}`, () => img.assertFormat(format));
			}

			if (width) {
				it(`image is ${width}px wide`, () => img.assertWidth(width));
			}

			if (height) {
				it(`image is ${height}px tall`, () => img.assertHeight(height));
			}

			if (color) {
				it('image has correct dominant color', () => img.assertDominantColor(color));
			}
		});
	}
});
