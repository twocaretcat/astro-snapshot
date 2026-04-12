import { DIMENSIONS_TEST_CASE_MAP } from './dimensions.ts';
import { EXTENSIONS_TEST_CASE_MAP } from './extensions.ts';
import { OTHER_TEST_CASE_MAP } from './other.ts';
import { OVERWRITE_DISABLED_TEST_CASE_MAP } from './overwrite-disabled.ts';
import { OVERWRITE_ENABLED_TEST_CASE_MAP } from './overwrite-enabled.ts';

/**
 * All test cases using a shared build.
 */
export const SHARED_TEST_CASE_MAP = {
	...DIMENSIONS_TEST_CASE_MAP,
	...EXTENSIONS_TEST_CASE_MAP,
	...OVERWRITE_DISABLED_TEST_CASE_MAP,
	...OVERWRITE_ENABLED_TEST_CASE_MAP,
	...OTHER_TEST_CASE_MAP,
} as const;
