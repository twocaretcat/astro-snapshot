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
const { page, expected } = DEFAULT;

/**
 * Scenarios: `defaults.width` and `defaults.height` should propagate to pages
 * that omit their own dimensions and be overridden by pages that specify them.
 */
export const DEFAULT_DIMENSIONS_TEST_CASE_MAP: Record<string, IsolatedTestCase> = {
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
				...expected.image,
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
				...expected.image,
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
				...expected.image,
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
				...expected.image,
				...DIMENSION,
			},
		},
	},
};
