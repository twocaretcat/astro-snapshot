import { DIMENSION_TEST_CASES } from './dimension.ts';
import { EXTENSION_TEST_CASES } from './extension.ts';
import { OTHER_TEST_CASES } from './other.ts';
import { OVERWRITE_DISABLED_TEST_CASES } from './overwrite-disabled.ts';
import { OVERWRITE_ENABLED_TEST_CASES } from './overwrite-enabled.ts';

/**
 * All test cases.
 */
export const TEST_CASES = {
	...DIMENSION_TEST_CASES,
	...EXTENSION_TEST_CASES,
	...OVERWRITE_DISABLED_TEST_CASES,
	...OVERWRITE_ENABLED_TEST_CASES,
	...OTHER_TEST_CASES,
};
