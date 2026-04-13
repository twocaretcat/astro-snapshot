import { DEFAULT, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const { page, expected } = DEFAULT;

/**
 * Assorted test cases.
 */
export const OTHER_TEST_CASE_MAP: Record<string, TestCase> = {
	// A deviceScaleFactor of 2 should result in a screenshot that is twice as large
	'deviceScaleFactor viewport option': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/viewport-device-scale-factor.png`,
			width: 600,
			height: 315,
			setViewportOptions: {
				deviceScaleFactor: 2,
			},
		},
		expected,
	},
	// A page key without a leading '/' should be normalized
	'page path normalization': {
		page: 'red',
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/path-normalization.png`,
		},
		expected,
	},
};
