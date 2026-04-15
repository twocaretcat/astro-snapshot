/**
 * A logger for status messages related to individual input/output pairs.
 *
 * @module
 */
import type { AstroIntegrationLogger } from 'astro';
import { styleText } from 'node:util';

/**
 * Logs status messages for a fixed input/output pair.
 */
export class StatusLogger {
	readonly #ioString: string;

	/**
	 * Creates a new logger for a fixed input/output pair.
	 *
	 * @param logger - The Astro integration logger instance to use for output
	 * @param inputPath - The source file path to display
	 * @param outputPath - The destination file path to display
	 *
	 * @example
	 * ```ts
	 * const statusLogger = new StatusLogger(logger, 'src/input.ts', 'dist/output.js');
	 * ```
	 */
	constructor(
		private readonly logger: AstroIntegrationLogger,
		private readonly inputPath: string,
		private readonly outputPath: string,
	) {
		this.#ioString = `${this.inputPath} → ${this.outputPath}`;
	}

	private log(
		type: 'info' | 'warn' | 'error',
		color: Parameters<typeof styleText>[0],
		prefix: string,
		suffix?: string,
	) {
		this.logger[type](`${styleText(color, `${prefix}▶`)} ${this.#ioString}${suffix}`);
	}

	private formatStatus(msg: string | undefined) {
		return msg ? ` ${styleText('dim', `(${msg})`)}` : '';
	}

	/**
	 * Logs an info message with the input/output pair.
	 *
	 * @param msg - Optional warning text to append
	 *
	 * @example
	 * ```ts
	 * statusLogger.info();
	 * // Outputs (green): ▶ src/input.ts → dist/output.js
	 * ```
	 */
	info(msg?: string) {
		this.log('info', 'green', ' ', this.formatStatus(msg));
	}

	/**
	 * Logs a warning message with the input/output pair.
	 *
	 * @param msg - Optional warning text to append
	 *
	 * @example
	 * ```ts
	 * statusLogger.warn('skipped');
	 * // Outputs (yellow): ▶ src/input.ts → dist/output.js (skipped)
	 * ```
	 */
	warn(msg?: string) {
		this.log('warn', 'yellow', ' ', this.formatStatus(msg));
	}

	/**
	 * Logs an error message with the input/output pair and throws an error.
	 *
	 * @param msg - Optional warning text to append
	 *
	 * @example
	 * ```ts
	 * statusLogger.error('Some error message');
	 * // Outputs (red): ▶ src/input.ts → dist/output.js: Some error message
	 * ```
	 */
	error(msg?: string): never {
		this.log('error', 'red', '', msg ? `: ${msg}` : '');

		throw new Error();
	}
}
