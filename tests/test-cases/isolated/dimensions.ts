import { DEFAULT, ISOLATED_OUTPUT_DIR } from '../../constants.ts';
import { type IsolatedTestCase, TestSetup } from '../../types.ts';

const OUTPUT_FILENAME = 'output.png' as const;
const DEFAULT_DIMENSION = {
	width: 480,
	height: 360,
} as const;
const DIMENSION = {
	width: 192,
	height: 144,
} as const;
const { page } = DEFAULT;

const WIDTH_ERROR_MSG = 'Width must be greater than 0' as const;
const HEIGHT_ERROR_MSG = 'Height must be greater than 0' as const;

/**
 * Scenarios:
 * - `defaults.width` and `defaults.height` should propagate to pages
 * that omit their own dimensions and be overridden by pages that specify them.
 * - `width` or `height` values less than 0 should cause the build to fail.
 */
export const DIMENSIONS_TEST_CASE_MAP: Record<string, IsolatedTestCase> = {
	// Provided height should override the default but width should be inherited
	'default width': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-width/${OUTPUT_FILENAME}`,
			height: DIMENSION.height,
		},
		integrationConfig: {
			defaults: {
				width: DEFAULT_DIMENSION.width,
			},
		},
		setup: TestSetup.Clean,
		expected: {
			image: {
				width: DEFAULT_DIMENSION.width,
				height: DIMENSION.height,
			},
		},
	},
	// Provided width should override the default but height should be inherited
	'default height': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-height/${OUTPUT_FILENAME}`,
			width: DIMENSION.width,
		},
		integrationConfig: {
			defaults: {
				height: DEFAULT_DIMENSION.height,
			},
		},
		setup: TestSetup.Clean,
		expected: {
			image: {
				width: DIMENSION.width,
				height: DEFAULT_DIMENSION.height,
			},
		},
	},
	// With no width/height set, the integration should fall back to the default values
	'default width and height': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-width-and-height/${OUTPUT_FILENAME}`,
		},
		integrationConfig: {
			defaults: DEFAULT_DIMENSION,
		},
		setup: TestSetup.Clean,
		expected: {
			image: {
				...DEFAULT_DIMENSION,
			},
		},
	},
	// Provided width and height should override the defaults
	'default width and height (overridden per-page)': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-width-and-height-overridden/${OUTPUT_FILENAME}`,
			...DIMENSION,
		},
		integrationConfig: {
			defaults: DEFAULT_DIMENSION,
		},
		setup: TestSetup.Clean,
		expected: {
			image: {
				...DIMENSION,
			},
		},
	},
	// A zero-width image should cause the build to fail
	'zero-width': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/zero-width/${OUTPUT_FILENAME}`,
			width: 0,
		},
		expected: {
			build: {
				success: false,
				stderr: WIDTH_ERROR_MSG,
			},
		},
	},
	// A zero-height image should cause the build to fail
	'zero-height': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/zero-height/${OUTPUT_FILENAME}`,
			height: 0,
		},
		expected: {
			build: {
				success: false,
				stderr: HEIGHT_ERROR_MSG,
			},
		},
	},
	// A negative-width image should cause the build to fail
	'negative-width': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/negative-width/${OUTPUT_FILENAME}`,
			width: -1,
		},
		expected: {
			build: {
				success: false,
				stderr: WIDTH_ERROR_MSG,
			},
		},
	},
	// A negative-height image should cause the build to fail
	'negative height': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/negative-height/${OUTPUT_FILENAME}`,
			height: -1,
		},
		expected: {
			build: {
				success: false,
				stderr: HEIGHT_ERROR_MSG,
			},
		},
	},
};
