import { COLOR, DEFAULT, PAGE, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const { page } = DEFAULT;
const screenshotConfig = {
	outputPath: `${SHARED_OUTPUT_DIR}/overwrite-enabled.png`,
} as const;

/**
 * Test cases for `overwrite: true`.
 */
export const OVERWRITE_ENABLED_TEST_CASE_MAP: Record<string, TestCase> = {
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
			image: {
				color: COLOR.green,
			},
		},
	},
};
