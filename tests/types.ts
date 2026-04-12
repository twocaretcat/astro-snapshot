import type sharp from 'sharp';
import type { Config } from '../packages/astro-snapshot/src/index.ts';

/**
 * A color in the format `{ r: number, g: number, b: number }`.
 */
export type Color = sharp.Stats['dominant'];

/**
 * Properties an output image is expected to have.
 */
interface ImageExpectation {
	format: string;
	width: number;
	height: number;
	color: Color;
}

/**
 * An action to perform to prepare the test environment before running a test case scenario.
 */
export enum TestSetup {
	/** Remove the scenario's output directory */
	Clean,
	/** Write a placeholder file at `screenshotConfig.outputPath` */
	Seed,
}

/**
 * A test case for the shared build. `page` and `screenshotConfig` are required
 * since every shared entry corresponds to a real screenshot, even setup-only
 * entries that omit `expected`.
 */
export interface TestCase {
	/** Astro page route to screenshot. */
	readonly page: string;
	/** Config entry passed to the snapshot integration (includes `outputPath`). */
	readonly screenshotConfig: Config['pages'][string][number];
	/** Properties the produced image is expected to have. If undefined, no assertions are made (useful for setup). */
	readonly expected?: ImageExpectation;
}

/**
 * A test case for an isolated build. All page and config fields are optional
 * since some scenarios (ex. empty-pages) produce no output at all.
 *
 * In comparison with {@link TestCase}, omitting `expected` will assert that the output directory is empty.
 */
export interface IsolatedTestCase extends Partial<TestCase> {
	/**
	 * Integration-level config merged with the derived `pages` map.
	 *
	 * Used to set `defaults`, `port`, etc. for the scenario.
	 */
	readonly integrationConfig?: Omit<Config, 'pages'>;
	readonly setup?: TestSetup;
}
