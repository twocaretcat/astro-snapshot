import { join, resolve } from 'node:path';
import type { Color } from './types.ts';

/**
 * Absolute path to the fixture project root.
 */
export const ABS_FIXTURE_PATH = resolve(import.meta.dirname!, 'fixture');

/**
 * Directory (relative to the fixture project root) where all test outputs are organized under.
 */
export const OUTPUT_DIR = 'output' as const;

/**
 * Paths to pages in the fixture project.
 */
export const PAGE: Record<string, `/${string}`> = {
	red: '/red',
	green: '/green',
};

/**
 * Background colors used in the fixture project.
 */
export const COLOR: Record<string, Color> = {
	red: {
		r: 255,
		g: 0,
		b: 0,
	},
	green: {
		r: 0,
		g: 255,
		b: 0,
	},
};

/**
 * Output subdirectory for the shared build.
 */
export const SHARED_OUTPUT_DIR = join(OUTPUT_DIR, 'shared');

/**
 * Output subdirectory for isolated builds.
 */
export const ISOLATED_OUTPUT_DIR = join(OUTPUT_DIR, 'isolated');

export const DEFAULT = {
	/** Default fixture page to use for tests. */
	page: PAGE.red,
	/**
	 * Default image expectations for all tests.
	 *
	 * This is what the integration should fall back to.
	 */
	expected: {
		format: 'png',
		width: 1200,
		height: 630,
		color: COLOR.red,
	},
} as const;
