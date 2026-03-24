import assert from 'node:assert';
import { resolve } from 'node:path';
import { OUTPUT_DIR_NAME, OUTPUT_IMAGE_NAME } from './constants.ts';

const DIR_NAME = import.meta.dirname;

assert(DIR_NAME);

const ABS_FIXTURE_PATH = resolve(DIR_NAME, 'fixture');
const ABS_OUTPUT_PATH = resolve(ABS_FIXTURE_PATH, OUTPUT_DIR_NAME);
const ABS_OUTPUT_IMAGE_PATH = resolve(ABS_OUTPUT_PATH, OUTPUT_IMAGE_NAME);

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
});
