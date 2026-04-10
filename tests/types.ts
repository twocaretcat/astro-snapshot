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

export interface TestCase {
	/** Astro page route to screenshot. */
	readonly page: string;
	/** Config entry passed to the snapshot integration (includes `outputPath`). */
	readonly screenshotConfig: Config['pages'][string][number];
	/** Properties the produced image is expected to have. If undefined, no assertions are made (useful for setup). */
	readonly expected?: ImageExpectation;
}
