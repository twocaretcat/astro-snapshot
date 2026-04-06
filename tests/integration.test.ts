import assert, { strictEqual } from 'node:assert';
import { resolve } from 'node:path';
import { OUTPUT_DIR_NAME, OUTPUT_IMAGE_NAME } from './constants.ts';
import sharp from 'sharp';

const DIR_NAME = import.meta.dirname;

assert(DIR_NAME);

const ABS_FIXTURE_PATH = resolve(DIR_NAME, 'fixture');
const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, OUTPUT_DIR_NAME);
const ABS_OUTPUT_IMAGE_PATH = resolve(ABS_OUTPUT_PATH, OUTPUT_IMAGE_NAME);

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

// Clean up any existing screenshots so old files can't cause a false pass
Deno.test.beforeAll(async () => {
	try {
		await Deno.remove(ABS_OUTPUT_PATH, { recursive: true });
	} catch (error) {
		// Ignore if the directory doesn't exist yet, but re-throw everything else
		// (ie. missing --allow-write permission)
		if (!(error instanceof Deno.errors.NotFound)) throw error;
	}
});

// Run the Astro build inside the fixture project and assert the screenshot was created
Deno.test('fixture generates screenshot on build', async () => {
	const result = await new Deno.Command(Deno.execPath(), {
		args: ['run', '-A', 'astro', 'build'],
		cwd: ABS_FIXTURE_PATH,
		stdout: 'piped',
		stderr: 'piped',
	}).output();

	if (!result.success) {
		const textDecoder = new TextDecoder();
		const stdout = textDecoder.decode(result.stdout);
		const stderr = textDecoder.decode(result.stderr);

		throw new Error(`Astro build failed:\n${stdout}\n${stderr}`);
	}

	const stat = await Deno.stat(ABS_OUTPUT_IMAGE_PATH);

	assert(stat.isFile, `Expected screenshot at ${ABS_OUTPUT_IMAGE_PATH}`);
	assert(stat.size > 0, `Screenshot at ${ABS_OUTPUT_IMAGE_PATH} is empty`);

	const expected = {
		format: 'png',
		width: 1200,
		height: 630,
		color: {
			r: 255,
			g: 0,
			b: 0,
		},
	} as const;
	const image = sharp(ABS_OUTPUT_IMAGE_PATH);
	const { format, height, width } = await image.metadata();

	strictEqual(format, expected.format, `Expected format "${expected.format}", got "${format}"`);
	strictEqual(width, expected.width, `Expected width ${expected.width}px, got ${width}px`);
	strictEqual(height, expected.height, `Expected height ${expected.height}px, got ${height}px`);

	const { dominant } = await image.stats();
	const channels = keysOf(dominant);

	for (const channel of channels) {
		const actualValue = dominant[channel];
		const expectedValue = expected.color[channel];
		const minValue = expectedValue - 10;
		const maxValue = expectedValue + 10;

		assert(
			actualValue >= minValue,
			`Expected ${channel} channel >= ${minValue}, got ${actualValue}`,
		);
		assert(
			actualValue <= maxValue,
			`Expected ${channel} channel <= ${maxValue}, got ${actualValue}`,
		);
	}
});
