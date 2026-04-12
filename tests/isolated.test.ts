import { beforeAll, describe, it } from '@std/testing/bdd';
import { resolve } from 'node:path';
import { ABS_FIXTURE_PATH, ISOLATED_OUTPUT_DIR } from './constants.ts';
import { ISOLATED_TEST_CASE_MAP } from './test-cases/isolated/index.ts';
import { TestSetup } from './types.ts';
import { FileAsserter, ImageAsserter } from './utils/assertions.ts';
import { cleanOutput, runAstroBuildWithScenario, seedFile } from './utils/setup.ts';
import { highlight } from './utils/text.ts';

const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, ISOLATED_OUTPUT_DIR);

let file: FileAsserter;
let img: ImageAsserter;

await cleanOutput(ABS_OUTPUT_PATH);

describe('astro-snapshot isolated builds', () => {
	for (const [key, testCase] of Object.entries(ISOLATED_TEST_CASE_MAP)) {
		const { screenshotConfig, setup, expected } = testCase;
		const outputPath = screenshotConfig ? resolve(ABS_FIXTURE_PATH, screenshotConfig.outputPath) : null;
		const scenarioDir = resolve(ABS_OUTPUT_PATH, key);

		const hasOutput = expected && outputPath;

		describe(highlight`with ${key}`, () => {
			beforeAll(async () => {
				if (setup === TestSetup.Clean) {
					await cleanOutput(scenarioDir);
				}

				if (setup === TestSetup.Seed && outputPath) {
					await seedFile(outputPath);
				}

				await runAstroBuildWithScenario(key);

				if (!hasOutput) return;

				file = new FileAsserter(outputPath);
				img = new ImageAsserter(outputPath);
			});

			if (hasOutput) {
				it('image exists and is non-empty', () => file.assertExists());

				const { format, width, height, color } = expected;

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
			} else {
				it('output directory is not created', () => new FileAsserter(scenarioDir).assertAbsent());
			}
		});
	}
});
