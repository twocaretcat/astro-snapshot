import { DEFAULT, SHARED_OUTPUT_DIR } from '../../constants.ts';
import type { TestCase } from '../../types.ts';

const OUTPUT_FILENAME = 'format' as const;
const { page } = DEFAULT;

/**
 * Test cases for the `outputPath` file extension.
 */
export const EXTENSIONS_TEST_CASE_MAP: Record<string, TestCase> = {
	// A .png extension should result in a PNG screenshot
	'.png extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}.png`,
		},
		expected: {
			image: {
				format: 'png',
			},
		},
	},
	// A .jpg extension should result in a JPEG screenshot
	'.jpg extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}.jpg`,
		},
		expected: {
			image: {
				format: 'jpeg',
			},
		},
	},
	// A .jpeg extension should result in a JPEG screenshot
	'.jpeg extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}.jpeg`,
		},
		expected: {
			image: {
				format: 'jpeg',
			},
		},
	},
	// A .webp extension should result in a WebP screenshot
	'.webp extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}.webp`,
		},
		expected: {
			image: {
				format: 'webp',
			},
		},
	},
	// A .PNG extension should result in a PNG screenshot
	'.PNG extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}-uppercase.PNG`,
		},
		expected: {
			image: {
				format: 'png',
			},
		},
	},
	// A .JPG extension should result in a JPEG screenshot
	'.JPG extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}-uppercase.JPG`,
		},
		expected: {
			image: {
				format: 'jpeg',
			},
		},
	},
	// A .JPEG extension should result in a JPEG screenshot
	'.JPEG extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}-uppercase.JPEG`,
		},
		expected: {
			image: {
				format: 'jpeg',
			},
		},
	},
	// A .WEBP extension should result in a WebP screenshot
	'.WEBP extension': {
		page,
		screenshotConfig: {
			outputPath: `${SHARED_OUTPUT_DIR}/${OUTPUT_FILENAME}-uppercase.WEBP`,
		},
		expected: {
			image: {
				format: 'webp',
			},
		},
	},
};
