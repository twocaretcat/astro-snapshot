/**
 * Text formatting utilities for test output.
 *
 * @module
 */
import { styleText } from 'node:util';

/**
 * Tagged template literal that styles the interpolated values in cyan.
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
