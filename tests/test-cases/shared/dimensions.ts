import { DEFAULT, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const DIMENSION = {
	width: 192,
	height: 144,
} as const;
const { page, expected } = DEFAULT;

/**
 * Test cases for `width` and `height`.
 */
export const DIMENSIONS_TEST_CASE_MAP: Record<string, TestCase> = {
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
			width: DIMENSION.width,
		},
		expected: {
			...expected,
			width: DIMENSION.width,
		},
	},
	// Provided height should override the default
	'height': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/height.png`,
			height: DIMENSION.height,
		},
		expected: {
			...expected,
			height: DIMENSION.height,
		},
	},
	// Provided width and height should override the defaults
	'width & height': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/width-and-height.png`,
			...DIMENSION,
		},
		expected: {
			...expected,
			...DIMENSION,
		},
	},
};
