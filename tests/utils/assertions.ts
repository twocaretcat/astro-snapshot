/**
 * Assertion helpers for integration tests.
 *
 * Two classes are provided, each fetching file information once on construction
 * and exposing assertion methods that await the shared result:
 *
 * 1. FileAsserter: Wraps Deno.stat; covers existence, absence, and mtime checks.
 * 2. ImageAsserter: Wraps a Sharp instance; covers format, dimensions, and dominant color.
 *
 * @module
 */

import assert, { strictEqual } from 'node:assert';
import sharp from 'sharp';
import type { Color } from '../types.ts';

/**
 * Returns the keys of an object with proper TypeScript typing.
 *
 * @typeParam T - The object type.
 * @param obj - The object whose keys will be returned.
 * @returns An array of the object's keys, typed as `(keyof T)[]`.
 */
function keysOf<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

/**
 * Calls `Deno.stat` once on construction and provides assertion methods
 * that share the result.
 *
 * @example
 * const file = new FileAsserter(absolutePath);
 * await file.assertExists();
 */
export class FileAsserter {
	readonly #path: string;
	readonly #stat: Promise<Deno.FileInfo>;

	constructor(absolutePath: string) {
		this.#path = absolutePath;
		this.#stat = Deno.stat(absolutePath);
	}

	/** Asserts the file exists and is non-empty. */
	async assertExists(): Promise<void> {
		const stat = await this.#stat;

		assert(stat.isFile, `Expected an image file at ${this.#path}`);
		assert(stat.size > 0, `Image at ${this.#path} is empty`);
	}

	/**
	 * Asserts the path does not exist on disk.
	 * Used to confirm no output was written (e.g. when `pages` is empty).
	 */
	async assertAbsent(): Promise<void> {
		let exists = false;

		try {
			await this.#stat;

			exists = true;
		} catch (error) {
			if (!(error instanceof Deno.errors.NotFound)) throw error;
		}

		assert(!exists, `Expected path to not exist: ${this.#path}`);
	}
}

/**
 * Constructs a Sharp instance once and lazily fetches metadata and stats,
 * caching each so repeated assertions share the same result.
 *
 * @example
 * const image = new ImageAsserter(absolutePath);
 * await image.assertFormat('png');
 * await image.assertWidth(1200);
 * await image.assertDominantColor({ r: 255, g: 0, b: 0 });
 */
export class ImageAsserter {
	readonly #path: string;
	readonly #image: ReturnType<typeof sharp>;

	#metadata: Promise<sharp.Metadata> | undefined;
	#stats: Promise<sharp.Stats> | undefined;

	constructor(absolutePath: string) {
		this.#path = absolutePath;
		this.#image = sharp(absolutePath);
	}

	#getMetadata(): Promise<sharp.Metadata> {
		this.#metadata ??= this.#image.metadata();

		return this.#metadata;
	}

	#getStats(): Promise<sharp.Stats> {
		this.#stats ??= this.#image.stats();

		return this.#stats;
	}

	/** Asserts that the image format (e.g. `"png"`, `"jpeg"`) matches `expected`. */
	async assertFormat(expected: string): Promise<void> {
		const { format } = await this.#getMetadata();

		strictEqual(format, expected, `Expected format "${expected}", got "${format}" at ${this.#path}`);
	}

	/** Asserts that the image width in pixels matches `expected`. */
	async assertWidth(expected: number): Promise<void> {
		const { width } = await this.#getMetadata();

		strictEqual(width, expected, `Expected width ${expected}px, got ${width}px at ${this.#path}`);
	}

	/** Asserts that the image height in pixels matches `expected`. */
	async assertHeight(expected: number): Promise<void> {
		const { height } = await this.#getMetadata();

		strictEqual(height, expected, `Expected height ${expected}px, got ${height}px at ${this.#path}`);
	}

	/**
	 * Asserts that the dominant color of the image is within `threshold` of
	 * `expected` for each channel.
	 *
	 * @example
	 * // Predominantly red (#f00) background
	 * await image.assertDominantColor({ r: 255, g: 0, b: 0 });
	 */
	async assertDominantColor(expected: Color, threshold = 10): Promise<void> {
		const { dominant } = await this.#getStats();

		const channels = keysOf(dominant);

		for (const channel of channels) {
			const actual = dominant[channel];
			const min = expected[channel] - threshold;
			const max = expected[channel] + threshold;

			assert(actual >= min, `Expected ${channel} channel >= ${min}, got ${actual} at ${this.#path}`);
			assert(actual <= max, `Expected ${channel} channel <= ${max}, got ${actual} at ${this.#path}`);
		}
	}
}
