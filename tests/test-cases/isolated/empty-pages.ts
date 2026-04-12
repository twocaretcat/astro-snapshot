import type { IsolatedTestCase } from '../../types.ts';

/**
 * Scenario: `pages: {}` should cause the integration to warn and exit early
 * without creating any output.
 */
export const EMPTY_PAGES_TEST_CASE_MAP: Record<string, IsolatedTestCase> = {
	// The output directory should be empty
	'empty pages': {},
};
