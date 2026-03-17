import assert from 'node:assert';
import { resolve } from 'node:path';
import { OUTPUT_PATH } from './constants.ts';

const DIR_NAME = import.meta.dirname;

assert(DIR_NAME);

const FIXTURE_DIR = resolve(DIR_NAME, 'fixtures', 'basic');
const OUTPUT_IMAGE_PATH = resolve(FIXTURE_DIR, OUTPUT_PATH, 'index.png');

// Clean up any existing screenshots so old files can't cause a false pass
Deno.test.beforeAll(async () => {
	try {
		await Deno.remove(resolve(FIXTURE_DIR, OUTPUT_PATH), { recursive: true });
	} catch (err) {
		// Ignore if the directory doesn't exist yet, but re-throw everything else
		// (ie. missing --allow-write permission)
		if (!(err instanceof Deno.errors.NotFound)) throw err;
	}
});

// Run the Astro build inside the fixture project and assert the screenshot was created
Deno.test('basic fixture generates screenshots on build', async () => {
	const result = await new Deno.Command('deno', {
		args: ['run', 'build'],
		cwd: FIXTURE_DIR,
		stdout: 'piped',
		stderr: 'piped',
	}).output();

	if (!result.success) {
		const textDecoder = new TextDecoder();
		const stdout = textDecoder.decode(result.stdout);
		const stderr = textDecoder.decode(result.stderr);

		throw new Error(`Astro build failed:\n${stdout}\n${stderr}`);
	}

	const stat = await Deno.stat(OUTPUT_IMAGE_PATH);

	assert(stat.isFile, `Expected screenshot at ${OUTPUT_IMAGE_PATH}`);
	assert(stat.size > 0, `Screenshot at ${OUTPUT_IMAGE_PATH} is empty`);
});
