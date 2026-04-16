import { DEFAULT, PAGE, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const { page, expected } = DEFAULT;
const screenshotConfig = {
	outputPath: `${SHARED_OUTPUT_DIR}/overwrite-disabled.png`,
} as const;

/**
 * Test cases for `overwrite: false`.
 */
export const OVERWRITE_DISABLED_TEST_CASE_MAP: Record<string, TestCase> = {
	// 1. Set up the test by generating a red image
	'[setup] overwrite disabled': {
		page,
		screenshotConfig,
	},
	// 2. The second write should skip because overwrite is false
	'overwrite disabled': {
		page: PAGE.green,
		screenshotConfig: {
			...screenshotConfig,
			overwrite: false,
		},
		expected: {
			image: {
				color: expected.image.color,
			},
		},
	},
	// 3. The third write should also skip because overwrite is false by default
	'overwrite disabled (implicit)': {
		page: PAGE.green,
		screenshotConfig,
		expected: {
			image: {
				color: expected.image.color,
			},
		},
	},
};
