import { DEFAULT, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const { page, expected } = DEFAULT;

/**
 * Test cases for the `outputPath` file extension.
 */
export const EXTENSION_TEST_CASE_MAP: Record<string, TestCase> = {
	// A .png extension should result in a PNG screenshot
	'.png extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/format.png`,
		},
		expected: {
			...expected,
			format: 'png',
		},
	},
	// A .jpg extension should result in a JPEG screenshot
	'.jpg extension': {
		page,
		screenshotConfig: {
			// @ts-ignore TODO: Fix TypeError: .jpg isn't allowed as a file extension
			// see https://github.com/twocaretcat/astro-snapshot/issues/51
			outputPath: `${SHARED_OUTPUT_DIR}/format.jpg`,
		},
		expected: {
			...expected,
			format: 'jpeg',
		},
	},
	// A .jpeg extension should result in a JPEG screenshot
	'.jpeg extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/format.jpeg`,
		},
		expected: {
			...expected,
			format: 'jpeg',
		},
	},
	// A .webp extension should result in a WebP screenshot
	'.webp extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/format.webp`,
		},
		expected: {
			...expected,
			format: 'webp',
		},
	},
};
