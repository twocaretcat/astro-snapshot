/**
 * Astro integration for generating automated page snapshots using Puppeteer.
 *
 * This module provides an integration that runs after the build process,
 * starts a local static file server, and captures screenshots for configured
 * routes using a headless browser.
 *
 * See the {@link https://astro-snapshot.johng.io | documentation} for more information.
 *
 * @example
 * ```ts
 * // astro.config.ts
 * import { defineConfig } from 'astro/config';
 * import snapshot from '@twocaretcat/astro-snapshot';
 *
 * export default defineConfig({
 *   integrations: [
 *     snapshot({
 *       pages: {
 *         '/': [{ outputPath: 'src/assets/og.png' }],
 *       },
 *     }),
 *   ],
 * });
 * ```
 *
 * @module
 */
import type { AstroIntegration } from 'astro';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';
import { launch } from 'puppeteer';
import sirv from 'sirv';
import { StatusLogger } from './status-logger.ts';
import type {
	HandleBuildDone,
	HandleConfigDone,
	ResolvedScreenshotConfig,
	SnapshotIntegrationConfig,
} from './types.ts';
import { fileExists, formatDuration, getFormat, isExternalUrl } from './utils.ts';

/**
 * Creates an Astro integration that captures screenshots of specified pages
 * during the `astro:build:done` lifecycle event.
 *
 * @param config - Integration configuration, including page mappings, defaults,
 * and Puppeteer settings.
 * @returns The configured Astro integration.
 *
 * @example
 * ```ts
 * // Capture the home page and an about page with shared defaults
 * snapshot({
 *   pages: {
 *     '/': [{ outputPath: 'src/assets/home-og.png' }],
 *     '/about': [{ outputPath: 'src/assets/about-og.png' }],
 *   },
 *   defaults: {
 *     width: 1200,
 *     height: 630,
 *     overwrite: true,
 *   },
 * });
 * ```
 *
 * @example
 * ```ts
 * // Capture multiple screenshots of the same page at different sizes
 * snapshot({
 *   pages: {
 *     '/': [
 *       { outputPath: 'src/assets/og.png', width: 1200, height: 630 },
 *       { outputPath: 'src/assets/square.png', width: 512, height: 512 },
 *     ],
 *   },
 * });
 * ```
 */
export default function snapshot(
	config: SnapshotIntegrationConfig,
): AstroIntegration {
	// Integration-level config
	const pages = config.pages;
	const defaults = {
		...config.defaults,
	} as const;
	const launchOptions = {
		headless: true,
		...config.launchOptions,
	} as const;
	const port = config.port ?? 4322;
	// Resolved config
	const screenshots: ResolvedScreenshotConfig[] = [];
	let needsLocalServer = false;

	/**
	 * Handler for the `astro:config:done` lifecycle event.
	 * Resolves, validates, and saves all screenshot configuration for later use.
	 *
	 * @param options - Object containing the resolved Astro config and helper functions.
	 * @throws {Error} If the integration config is invalid.
	 */
	const handleConfigDone: HandleConfigDone = ({ config, logger }) => {
		const rootDir = fileURLToPath(config.root);

		for (const [pagePath, screenshotConfigs] of Object.entries(pages)) {
			const pageIsExternal = isExternalUrl(pagePath);

			if (!pageIsExternal) {
				needsLocalServer = true;
			}

			const pageUrl = pageIsExternal ? pagePath : new URL(pagePath, `http://localhost:${port}`).href;

			for (const screenshotConfig of screenshotConfigs) {
				const width = screenshotConfig.width ?? defaults.width ?? 1200;
				const height = screenshotConfig.height ?? defaults.height ?? 630;
				const { outputPath } = screenshotConfig;
				const absoluteOutputPath = resolve(rootDir, outputPath);
				const statusLogger = new StatusLogger(logger, pagePath, outputPath);

				if (width < 1) {
					statusLogger.error('Width must be greater than 0. Please check your Astro config.');
				}

				if (height < 1) {
					statusLogger.error('Height must be greater than 0. Please check your Astro config.');
				}

				screenshots.push({
					pageUrl,
					absoluteOutputPath,
					width,
					height,
					overwrite: screenshotConfig.overwrite ?? defaults.overwrite ?? false,
					goToOptions: {
						waitUntil: 'networkidle2',
						...defaults.gotoOptions,
						...screenshotConfig.gotoOptions,
					} as const,
					screenshotOptions: {
						path: absoluteOutputPath,
						type: getFormat(outputPath),
						fullPage: false,
						...defaults.screenshotOptions,
						...screenshotConfig.screenshotOptions,
					} as const,
					setViewportOptions: {
						...defaults.setViewportOptions,
						...screenshotConfig.setViewportOptions,
					} as const,
					statusLogger,
				});
			}
		}
	};

	/**
	 * Handler for the `astro:build:done` lifecycle event.
	 * Consumes the pre-resolved config, optionally starts a static file server for local pages, then uses Puppeteer to capture all configured screenshots.
	 *
	 * @param options - Object containing the build output directory and Astro logger instance.
	 */
	const handleBuildDone: HandleBuildDone = async ({ dir, logger }) => {
		const startTime = performance.now();

		logger.info('🔭 Integration loaded.');

		if (screenshots.length === 0) {
			logger.warn('No pages configured for screenshot generation. Skipping...');

			return;
		}

		// Start a static file server when at least one page is local
		const server = needsLocalServer ? createServer(sirv(fileURLToPath(dir))) : null;

		if (server) {
			await new Promise<void>((resolve) => server.listen(port, resolve));
		}

		// Launch Puppeteer
		const browser = await launch(launchOptions);

		logger.info('🔭 Generating screenshots...');

		logger.label = '';

		try {
			for (const screenshot of screenshots) {
				const {
					pageUrl,
					absoluteOutputPath,
					width,
					height,
					overwrite,
					goToOptions,
					screenshotOptions,
					setViewportOptions,
					statusLogger,
				} = screenshot;

				const doesFileExist = await fileExists(absoluteOutputPath);

				if (doesFileExist && !overwrite) {
					statusLogger.warn('skipped');

					continue;
				}

				// Ensure output directory exists
				await mkdir(dirname(absoluteOutputPath), { recursive: true });

				// Create page and take screenshot
				const page = await browser.newPage();

				await page.setViewport({
					width,
					height,
					...setViewportOptions,
				});
				await page.goto(pageUrl, goToOptions);
				await page.screenshot(screenshotOptions);
				await page.close();

				if (doesFileExist && overwrite) {
					statusLogger.warn('overwritten');
				} else {
					statusLogger.info();
				}
			}
		} finally {
			await browser.close();

			if (server) {
				await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
			}
		}

		logger.info(
			styleText('green', `✓ Completed in ${formatDuration(performance.now() - startTime)}.`),
		);
	};

	return {
		name: 'astro-snapshot',
		hooks: {
			'astro:config:done': handleConfigDone,
			'astro:build:done': handleBuildDone,
		},
	};
}

/**
 * Type helper for the integration configuration
 */
export type { SnapshotIntegrationConfig as Config };
