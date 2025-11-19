/**
 * Utility functions for the Astro Snapshot integration.
 *
 * @module
 */
import { access } from 'node:fs/promises';
import type { Format } from './types.ts';
import { styleText } from 'node:util';
import type { AstroIntegrationLogger } from 'astro';

/**
 * Extracts and normalizes the image format from a given file path.
 *
 * Determines the file extension following the last period (".") in the path,
 * ensuring it is part of the filename (not a directory). The function
 * normalizes certain extensions (e.g., `"jpg"` → `"jpeg"`) and validates
 * that the format is supported.
 *
 * @param path - The file path to extract the format from.
 * @returns The normalized image format as a {@link Format}.
 *
 * @throws {Error} If no valid file extension is found or the extension is unsupported.
 *
 * @example
 * ```ts
 * getFormat('/images/photo.jpg'); // 'jpeg'
 * getFormat('C:\\assets\\icon.webp'); // 'webp'
 * getFormat('file.png'); // 'png'
 * ```
 */
export function getFormat(path: string): Format {
	const lastDot = path.lastIndexOf('.');
	const lastSlash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

	// No dot, or dot is part of a directory (e.g., ".config/file")
	if (lastDot <= lastSlash) {
		throw new Error('No file extension found');
	}

	const extension = path.slice(lastDot + 1);

	if (extension === 'jpg' || extension === 'jpeg') {
		return 'jpeg';
	}

	if (extension === 'png' || extension === 'webp') {
		return extension;
	}

	throw new Error('Unsupported extension');
}

/**
 * Checks if a file exists at the given path.
 *
 * @param path - The file path to check.
 * @returns A promise that resolves to `true` if the file exists, `false` otherwise.
 *
 * @example
 * ```ts
 * if (await fileExists('/path/to/file.png')) {
 *   console.log('File exists');
 * }
 * ```
 */
export async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);

		return true;
	} catch {
		return false;
	}
}

/**
 * Logs a status message showing input/output file paths with optional warning.
 *
 * @param logger - The Astro integration logger instance to use for output
 * @param inputPath - The source file path to display
 * @param outputPath - The destination file path to display
 * @param warningLabel - Optional warning text to append. If provided, logs as warning in yellow; otherwise logs as info in green
 *
 * @example
 * ```ts
 * logStatus(logger, 'src/input.ts', 'dist/output.js');
 * // Outputs (green): ▶ src/input.ts → dist/output.js
 *
 * logStatus(logger, 'src/input.ts', 'dist/output.js', 'skipped');
 * // Outputs (yellow): ▶ src/input.ts → dist/output.js (skipped)
 * ```
 */
export function logStatus(
	logger: AstroIntegrationLogger,
	inputPath: string,
	outputPath: string,
	warningLabel?: string,
) {
	const [method, color, status] = warningLabel
		? ['warn', 'yellow', ` ${styleText('dim', `(${warningLabel})`)}`] as const
		: ['info', 'green', ''] as const;

	const bullet = styleText(color, '▶');
	const io = `${inputPath} → ${outputPath}`;

	logger[method](`  ${bullet} ${io}${status}`);
}

/**
 * Formats a duration in milliseconds as a human-readable string.
 *
 * Values under 1000ms are displayed as whole milliseconds (e.g., "53ms").
 * Values 1000ms and above are displayed as seconds with one decimal place (e.g., "1.4s").
 *
 * @param ms - The duration in milliseconds to format
 * @returns A formatted duration string with appropriate unit suffix
 *
 * @example
 * ```ts
 * formatDuration(53);    // "53ms"
 * formatDuration(1400);  // "1.4s"
 * formatDuration(5230);  // "5.2s"
 * ```
 */
export function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${Math.round(ms)}ms`;
	}

	return `${(ms / 1000).toFixed(1)}s`;
}
