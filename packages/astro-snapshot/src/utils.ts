/**
 * Utility functions for the Astro Snapshot integration.
 *
 * @module
 */
import { access } from 'node:fs/promises';
import type { Format } from './types.ts';

/**
 * Extracts and normalizes the image format from a given file path.
 *
 * Determines the file extension following the last period ('.') in the path,
 * ensuring it is part of the filename (not a directory). The function
 * normalizes certain extensions (ex. `'jpg'` → `'jpeg'`) and validates
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

	// No dot, or dot is part of a directory (ex. '.config/file')
	if (lastDot <= lastSlash) {
		throw new Error('No file extension found');
	}

	const extension = path.slice(lastDot + 1).toLowerCase();

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
 * Returns `true` if the input string is an absolute `http://` or `https://` URL.
 *
 * @param str - A string to check.
 *
 * @example
 * ```ts
 * isExternalUrl('https://example.com'); // true
 * isExternalUrl('/about');              // false
 * isExternalUrl('about');               // false
 * ```
 */
export function isExternalUrl(str: string): boolean {
	return str.startsWith('http://') || str.startsWith('https://');
}

/**
 * Formats a duration in milliseconds as a human-readable string.
 *
 * Values under 1000ms are displayed as whole milliseconds (ex. '53ms').
 * Values 1000ms and above are displayed as seconds with one decimal place (ex. '1.4s').
 *
 * @param ms - The duration in milliseconds to format
 * @returns A formatted duration string with appropriate unit suffix
 *
 * @example
 * ```ts
 * formatDuration(53);    // '53ms'
 * formatDuration(1400);  // '1.4s'
 * formatDuration(5230);  // '5.2s'
 * ```
 */
export function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${Math.round(ms)}ms`;
	}

	return `${(ms / 1000).toFixed(1)}s`;
}
