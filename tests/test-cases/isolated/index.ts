import type { IsolatedTestCase } from '../../types.ts';
import { DEFAULT_OVERWRITE_TEST_CASE_MAP } from './default-overwrite.ts';
import { DIMENSIONS_TEST_CASE_MAP } from './dimensions.ts';
import { EMPTY_PAGES_TEST_CASE_MAP } from './empty-pages.ts';

/**
 * All test cases using isolated builds.
 */
export const ISOLATED_TEST_CASE_MAP: Record<string, IsolatedTestCase> = {
	...EMPTY_PAGES_TEST_CASE_MAP,
	...DEFAULT_OVERWRITE_TEST_CASE_MAP,
	...DIMENSIONS_TEST_CASE_MAP,
};
