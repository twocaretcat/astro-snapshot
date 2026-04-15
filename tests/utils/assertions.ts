/**
 * Assertion helpers for integration tests.
 *
 * Three classes are provided:
 *
 * 1. BuildAsserter: Asserts on the outcome of an Astro build.
 * 2. FileAsserter: Asserts on the existence or absence of a file in the build output.
 * 3. ImageAsserter: Asserts on properties of an image in the build output like format, dimensions, and dominant color.
 *
 * @module
 */

import assert, { strictEqual } from 'node:assert';
import sharp from 'sharp';
import type { BuildResult, Color } from '../types.ts';

/**
 * Accepts a {@link BuildResult} and provides assertion methods over it.
 *
 * @param result - The build result returned by `runAstroBuildWithScenario()`.
 *
 * @example
 * const build = new BuildAsserter(result);
 * await build.assertSuccess();
 * await build.assertStderrContains('Invalid width');
 */
export class BuildAsserter {
	readonly #result: BuildResult;

	constructor(result: BuildResult) {
		this.#result = result;
	}

	/**
	 * Asserts that the build succeeded or failed.
	 *
	 * @param expected - Pass `false` to assert that the build failed. Defaults to `true`.
	 */
	assertSuccess(expected = true) {
		strictEqual(
			this.#result.success === expected,
			expected
				? `Expected build to succeed, but it failed:\n${this.#result.stdout}\n${this.#result.stderr}`
				: 'Expected build to fail, but it succeeded',
		);
	}

	/**
	 * Asserts that the build stdout contains `text`.
	 *
	 * @param text - The substring expected to appear in stdout.
	 */
	assertStdoutContains(text: string) {
		assert(
			this.#result.stdout.includes(text),
			`Expected stdout to contain '${text}'`,
		);
	}

	/**
	 * Asserts that the build stderr contains `text`.
	 *
	 * @param text - The substring expected to appear in stderr.
	 */
	assertStderrContains(text: string) {
		assert(
			this.#result.stderr.includes(text),
			`Expected stderr to contain '${text}'`,
		);
	}
}

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
 * @param absolutePath - Absolute path to the file to assert against.
 *
 * @example
 * const file = new FileAsserter(absolutePath);
 * await file.assertExists();
 */
export class FileAsserter {
	readonly #path: string;

	#stat: Promise<Deno.FileInfo> | undefined;

	constructor(absolutePath: string) {
		this.#path = absolutePath;
	}

	#getStat(): Promise<Deno.FileInfo> {
		this.#stat ??= Deno.stat(this.#path);

		return this.#stat;
	}

	/** Asserts the file exists and is non-empty. */
	async assertExists(): Promise<void> {
		const stat = await this.#getStat();

		assert(stat.isFile, `Expected an image file at ${this.#path}`);
		assert(stat.size > 0, `Image at ${this.#path} is empty`);
	}

	/**
	 * Asserts the path does not exist on disk.
	 * Used to confirm no output was written (ex. when `pages` is empty).
	 */
	async assertAbsent(): Promise<void> {
		let exists = false;

		try {
			await this.#getStat();

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
 * @param absolutePath - Absolute path to the image file to assert against.
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

	/** Asserts that the image format (ex. `'png'`, `'jpeg'`) matches `expected`.
	 *
	 * @param expected - The expected image format string.
	 */
	async assertFormat(expected: string): Promise<void> {
		const { format } = await this.#getMetadata();

		strictEqual(format, expected, `Expected format '${expected}', got '${format}' at ${this.#path}`);
	}

	/** Asserts that the image width in pixels matches `expected`.
	 *
	 * @param expected - The expected width in pixels.
	 */
	async assertWidth(expected: number): Promise<void> {
		const { width } = await this.#getMetadata();

		strictEqual(width, expected, `Expected width ${expected}px, got ${width}px at ${this.#path}`);
	}

	/** Asserts that the image height in pixels matches `expected`.
	 *
	 * @param expected - The expected height in pixels.
	 */
	async assertHeight(expected: number): Promise<void> {
		const { height } = await this.#getMetadata();

		strictEqual(height, expected, `Expected height ${expected}px, got ${height}px at ${this.#path}`);
	}

	/**
	 * Asserts that the dominant color of the image is within `threshold` of
	 * `expected` for each channel.
	 *
	 * @param expected - The expected dominant color.
	 * @param threshold - Allowable deviation per channel (default: 10).
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
