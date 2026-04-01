/**
 * Type definitions for the Astro Snapshot integration.
 *
 * @module
 */

import type { AstroIntegration } from 'astro';
import type { GoToOptions, ScreenshotOptions, Viewport } from 'puppeteer';
import type puppeteer from 'puppeteer';

/**
 * Supported image output formats for screenshots.
 * Derived from Puppeteer's {@link ScreenshotOptions.type}.
 *
 * @example
 * ```ts
 * const format: Format = 'png';
 * ```
 */
export type Format = Exclude<ScreenshotOptions['type'], undefined>;

/**
 * Type alias for the Astro `astro:config:done` hook handler.
 * Triggered after the Astro configuration is finalized.
 */
export type HandleConfigDone = AstroIntegration['hooks']['astro:config:done'];

/**
 * Type alias for the Astro `astro:build:done` hook handler.
 * Triggered after the build process completes.
 */
export type HandleBuildDone = AstroIntegration['hooks']['astro:build:done'];

/**
 * Configuration for a single page screenshot.
 *
 * @example
 * ```ts
 * const config: ScreenshotConfig = {
 *   outputPath: 'src/assets/og.png',
 *   width: 1200,
 *   height: 630,
 *   overwrite: true,
 *   gotoOptions: { waitUntil: 'networkidle0' },
 * };
 * ```
 */
export interface ScreenshotConfig {
	/**
	 * Custom output path for the screenshot.
	 * Can be absolute or relative to the project root.
	 * @default `public/screenshots/${pagePath}.png`
	 *
	 * @example
	 * ```ts
	 * outputPath: 'src/assets/og.webp'
	 * ```
	 */
	outputPath: `${string}.${Format}`;

	/**
	 * Width of the screenshot viewport in pixels.
	 * @default 1200 // OpenGraph standard width
	 *
	 * @example
	 * ```ts
	 * width: 1920
	 * ```
	 */
	width?: number;

	/**
	 * Height of the screenshot viewport in pixels.
	 * @default 630 // OpenGraph standard height
	 *
	 * @example
	 * ```ts
	 * height: 1080
	 * ```
	 */
	height?: number;

	/**
	 * Whether to overwrite existing screenshots. If `false` and the file exists, the screenshot will be skipped.
	 * @default false
	 *
	 * @example
	 * ```ts
	 * overwrite: true   // always regenerate
	 * ```
	 */
	overwrite?: boolean;

	/**
	 * Options to pass to Puppeteer's `page.goto()` method.
	 * Controls how navigation and page loading are handled.
	 * @see https://pptr.dev/api/puppeteer.waitforoptions
	 *
	 * @example
	 * ```ts
	 * gotoOptions: { waitUntil: 'networkidle0' }
	 * ```
	 */
	gotoOptions?: GoToOptions;

	/**
	 * Options to pass to Puppeteer's `page.screenshot()` method.
	 * Note: `path` will be overridden by the integration.
	 * Note: `format` will be inferred from the output path.
	 * @see https://pptr.dev/api/puppeteer.screenshotoptions
	 *
	 * @example
	 * ```ts
	 * screenshotOptions: { quality: 90 }
	 * ```
	 */
	screenshotOptions?: Omit<ScreenshotOptions, 'path' | 'format'>;

	/**
	 * Options to pass to Puppeteer's `page.setViewport()` method.
	 * Note: `width` and `height` will be merged with these options.
	 * @see https://pptr.dev/api/puppeteer.viewport
	 *
	 * @example
	 * ```ts
	 * setViewportOptions: { deviceScaleFactor: 2 }
	 * ```
	 */
	setViewportOptions?: Omit<Viewport, 'width' | 'height'>;
}

/**
 * Global configuration for the snapshot integration.
 * Defines which pages to capture, default behavior,
 * and Puppeteer launch settings.
 *
 * @example
 * ```ts
 * const config: SnapshotIntegrationConfig = {
 *   pages: {
 *     '/': [{ outputPath: 'src/assets/home-og.png' }],
 *     '/about': [{ outputPath: 'src/assets/about-og.png' }],
 *   },
 *   defaults: {
 *     width: 1200,
 *     height: 630,
 *     overwrite: true,
 *   },
 *   launchOptions: {
 *     args: ['--no-sandbox', '--disable-setuid-sandbox'],
 *   },
 * };
 * ```
 */
export interface SnapshotIntegrationConfig {
	/**
	 * Map of page paths to their screenshot configurations.
	 * Each key represents a route (e.g., "/", "/about", "/blog/post-1").
	 *
	 * @example
	 * ```ts
	 * pages: {
	 *   '/': [{ outputPath: 'src/assets/home-og.png' }],
	 *   '/about': [
	 *     { outputPath: 'src/assets/about-og.png', width: 1200, height: 630 },
	 *     { outputPath: 'src/assets/about-square.png', width: 512, height: 512 },
	 *   ],
	 * }
	 * ```
	 */
	pages: Record<string, ScreenshotConfig[]>;

	/**
	 * Default configuration applied to all pages.
	 * Can be overridden per page in `pages`.
	 *
	 * @example
	 * ```ts
	 * defaults: {
	 *   width: 512,
	 *   height: 512,
	 *   overwrite: true,
	 * }
	 * ```
	 */
	defaults?: Omit<ScreenshotConfig, 'outputPath'>;

	/**
	 * Puppeteer launch options.
	 * @see https://pptr.dev/api/puppeteer.launchoptions
	 *
	 * @example
	 * ```ts
	 * launchOptions: {
	 *   args: ['--no-sandbox', '--disable-setuid-sandbox'],
	 * }
	 * ```
	 */
	launchOptions?: Parameters<typeof puppeteer.launch>[0];

	/**
	 * Port for the local server during build.
	 * Used to render pages before screenshot generation.
	 * @default 4322
	 *
	 * @example
	 * ```ts
	 * port: 8080
	 * ```
	 */
	port?: number;
}
