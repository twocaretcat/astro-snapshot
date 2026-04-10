import { COLOR, DEFAULT, PAGE, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { FixtureImage } from '../../types.ts';

const { page, expected } = DEFAULT;
const screenshotConfig = {
	outputPath: `${SHARED_OUTPUT_DIR}/overwrite-enabled.png`,
} as const;

/**
 * Test cases for `overwrite: true`.
 */
export const OVERWRITE_ENABLED_TEST_CASES: Record<string, FixtureImage> = {
	// 1. Set up the test by generating a red image
	'[setup] overwrite enabled': {
		page,
		screenshotConfig,
	},
	// 2. The second write should replace the image because overwrite is true
	'overwrite enabled': {
		page: PAGE.green,
		screenshotConfig: {
			...screenshotConfig,
			overwrite: true,
		},
		expected: {
			...expected,
			// The image should now be green
			color: COLOR.green,
		},
	},
};
