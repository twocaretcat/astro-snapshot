/**
 * Helpers for setting up and tearing down the Astro fixture used in integration tests.
 *
 * @module
 */
import { info } from 'node:console';
import { highlight } from './text.ts';
import { ABS_FIXTURE_PATH } from '../constants.ts';

/**
 * Removes the output directory so stale screenshots can't cause a false pass.
 * Silently succeeds if the directory doesn't exist yet.
 */
export async function cleanOutput(absoluteOutputPath: string) {
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
 * Runs `astro build` inside the fixture project for the given scenario.
 *
 * Throws with combined stdout/stderr if the build fails.
 */
export async function runAstroBuildWithScenario(scenario: string) {
	info(highlight`🔨 Running \`astro build\` for scenario ${scenario}...`);

	const result = await new Deno.Command(Deno.execPath(), {
		args: ['run', '-A', 'astro', 'build'],
		cwd: ABS_FIXTURE_PATH,
		stdout: 'piped',
		stderr: 'piped',
		// Deno merges these with the inherited parent environment
		env: {
			SCENARIO: scenario,
		},
	}).output();

	if (!result.success) {
		const decoder = new TextDecoder();
		const stdout = decoder.decode(result.stdout);
		const stderr = decoder.decode(result.stderr);

		throw new Error(`Astro build failed:\n${stdout}\n${stderr}`);
	}
}
