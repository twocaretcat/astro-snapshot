/**
 * Text formatting utilities for test output.
 *
 * @module
 */
import { styleText } from 'node:util';

/**
 * Tagged template literal that styles interpolated values in cyan.
 *
 * @param strings - The static string parts of the template literal.
 * @param values - The interpolated values to style in cyan.
 *
 * @example
 * describe(highlight`with ${key}`, () => { ... });
 * // → "with bare bones" where "bare bones" is cyan
 */
export function highlight(strings: TemplateStringsArray, ...values: unknown[]): string {
	return strings.reduce<string>((result, str, i) =>
		[
			result,
			str,
			i < values.length ? styleText('cyan', String(values[i])) : '',
		].join(''), '');
}
