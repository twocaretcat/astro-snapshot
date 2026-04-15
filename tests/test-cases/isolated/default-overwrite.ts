import { DEFAULT, ISOLATED_OUTPUT_DIR } from '../../constants.ts';
import { type IsolatedTestCase, TestSetup } from '../../types.ts';

const OUTPUT_FILENAME = 'output.png' as const;
const { page, expected } = DEFAULT;

/**
 * Scenarios: `defaults.overwrite` should propagate to pages that omit their own
 * overwrite setting and be overridden by pages that specify it.
 */
export const DEFAULT_OVERWRITE_TEST_CASE_MAP: Record<string, IsolatedTestCase> = {
	// With overwrite enabled by default, the seeded file should be overwritten
	'default overwrite enabled': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-overwrite-enabled/${OUTPUT_FILENAME}`,
		},
		integrationConfig: {
			defaults: {
				overwrite: true,
			},
		},
		setup: TestSetup.Seed,
		expected,
	},
	// With overwrite disabled by default, the seeded file should not be overwritten
	'default overwrite disabled': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-overwrite-disabled/${OUTPUT_FILENAME}`,
		},
		integrationConfig: {
			defaults: {
				overwrite: false,
			},
		},
		setup: TestSetup.Seed,
		// Just assert that the file exists (no image-specific assertions)
		expected: {
			build: {
				success: true,
			},
		},
	},
	// With overwrite enabled by default, but disabled per-page, the seeded file should not be overwritten
	'default overwrite enabled (overridden per-page)': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-overwrite-enabled-overridden/${OUTPUT_FILENAME}`,
			overwrite: false,
		},
		integrationConfig: {
			defaults: {
				overwrite: true,
			},
		},
		setup: TestSetup.Seed,
		// Just assert that the file exists (no image-specific assertions)
		expected: {
			build: {
				success: true,
			},
		},
	},
	// With overwrite disabled by default, but enabled per-page, the seeded file should be overwritten
	'default overwrite disabled (overridden per-page)': {
		page,
		screenshotConfig: {
			outputPath: `${ISOLATED_OUTPUT_DIR}/default-overwrite-disabled-overridden/${OUTPUT_FILENAME}`,
			overwrite: true,
		},
		integrationConfig: {
			defaults: {
				overwrite: false,
			},
		},
		setup: TestSetup.Seed,
		expected,
	},
};
