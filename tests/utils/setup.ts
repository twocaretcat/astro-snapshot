/**
 * Helpers for setting up and tearing down the Astro fixture used in integration tests.
 *
 * @module
 */
import { info } from 'node:console';
import { highlight } from './text.ts';

/**
 * Removes the output directory so stale screenshots can't cause a false pass.
 * Silently succeeds if the directory doesn't exist yet.
 */
export async function cleanOutput(absoluteOutputPath: string): Promise<void> {
	info(highlight`🧹 Cleaning output directory at ${absoluteOutputPath}...`);

	try {
		await Deno.remove(absoluteOutputPath, { recursive: true });
	} catch (error) {
		// Ignore if the directory doesn't exist yet, but re-throw everything else
		// (i.e. missing --allow-write permission)
		if (!(error instanceof Deno.errors.NotFound)) throw error;
	}
}

/**
 * Runs `astro build` inside the fixture project.
 * Throws with combined stdout/stderr if the build fails.
 */
export async function runAstroBuild(absoluteFixturePath: string): Promise<void> {
	info(highlight`🔨 Running \`astro build\` in ${absoluteFixturePath}...`);

	const result = await new Deno.Command(Deno.execPath(), {
		args: ['run', '-A', 'astro', 'build'],
		cwd: absoluteFixturePath,
		stdout: 'piped',
		stderr: 'piped',
	}).output();

	if (!result.success) {
		const decoder = new TextDecoder();
		const stdout = decoder.decode(result.stdout);
		const stderr = decoder.decode(result.stderr);

		throw new Error(`Astro build failed:\n${stdout}\n${stderr}`);
	}
}
