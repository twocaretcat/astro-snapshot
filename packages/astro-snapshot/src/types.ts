/**
 * Type definitions for the Astro Snapshot integration.
 *
 * @module
 */

import type { AstroIntegration } from 'astro';
import type { GoToOptions, ScreenshotOptions, Viewport } from 'puppeteer';
import type puppeteer from 'puppeteer';

type MaybeUppercase<T extends string> = T | Uppercase<T>;

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
 * Supported file extensions for screenshots.
 *
 * @example
 * ```ts
 * const extension: Extension = '.jpg';
 * ```
 */
export type Extension = MaybeUppercase<`.${Format | 'jpg'}`>;

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
	outputPath: `${string}${Extension}`;

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
	 * Options to pass to Puppeteer's {@link https://pptr.dev/api/puppeteer.gotooptions | page.goto()} method.
	 *
	 * @example
	 * ```ts
	 * gotoOptions: { waitUntil: 'networkidle0' }
	 * ```
	 */
	gotoOptions?: GoToOptions;

	/**
	 * Options to pass to Puppeteer's {@link https://pptr.dev/api/puppeteer.screenshotoptions | page.screenshot()} method.
	 *
	 * @remarks `path` will be overridden by the integration. `format` will be inferred from the output path.
	 *
	 * @example
	 * ```ts
	 * screenshotOptions: { quality: 90 }
	 * ```
	 */
	screenshotOptions?: Omit<ScreenshotOptions, 'path' | 'format'>;

	/**
	 * Options to pass to Puppeteer's {@link https://pptr.dev/api/puppeteer.viewport | page.setViewport()} method.
	 *
	 * @remarks `width` and `height` will be merged with these options.
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
	 * Each key represents a route (ex. "/", "/about", "/blog/post-1").
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
	 * Options to pass to Puppeteer's {@link https://pptr.dev/api/puppeteer.launchoptions | launch()} method.
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
