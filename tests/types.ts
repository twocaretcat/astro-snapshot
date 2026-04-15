import type sharp from 'sharp';
import type { Config } from '../packages/astro-snapshot/src/index.ts';
import type { Format } from '../packages/astro-snapshot/src/types.ts';

/**
 * A color in the format `{ r: number, g: number, b: number }`.
 */
export type Color = sharp.Stats['dominant'];

/**
 * Output from an Astro build.
 */
export interface BuildResult {
	/** Whether the build was successful or not. */
	success: boolean;
	/** Stdout from the build command. */
	stdout: string;
	/** Stderr from the build command. */
	stderr: string;
}

/**
 * Properties of an output image.
 */
interface ImageResult {
	format: Format;
	width: number;
	height: number;
	color: Color;
}

/**
 * Combined expectation for a test case, covering both the build outcome and the properties of any generated image.
 *
 * If a property is omitted, it will not be checked (aside from the build, which is expected to succeed by default).
 */
export interface Expectation {
	/** Expected build outcome. Defaults to a successful build with no output assertions. */
	build?: Partial<BuildResult>;
	/** Expected properties of the generated image. */
	image?: Partial<ImageResult>;
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
	readonly expected?: Expectation;
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
