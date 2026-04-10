import { DEFAULT, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { FixtureImage } from '../../types.ts';

const { page, expected } = DEFAULT;

/**
 * Test cases for `width` and `height`.
 */
export const DIMENSION_TEST_CASES: Record<string, FixtureImage> = {
	// With no width/height set, the integration should fall back to the default values
	'bare bones': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/bare-bones.png`,
		},
		expected,
	},
	// Provided width should override the default
	'width': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/width.png`,
			width: 80,
		},
		expected: {
			...expected,
			width: 80,
		},
	},
	// Provided height should override the default
	'height': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/height.png`,
			height: 40,
		},
		expected: {
			...expected,
			height: 40,
		},
	},
	// Provided width and height should override the defaults
	'width & height': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/width-and-height.png`,
			width: 80,
			height: 40,
		},
		expected: {
			...expected,
			width: 80,
			height: 40,
		},
	},
};
