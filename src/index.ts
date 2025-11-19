/**
 * Astro integration for generating automated page snapshots using Puppeteer.
 *
 * This module provides an integration that runs after the build process,
 * starts a local preview server, and captures screenshots for configured
 * routes using a headless browser.
 *
 * @module
 */
import { styleText } from 'node:util';
import { type AstroConfig, type AstroIntegration, preview } from 'astro';
import { launch } from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import type { HandleBuildDone, HandleConfigDone, ScreenshotConfig, SnapshotIntegrationConfig } from './types.ts';
import { fileExists, formatDuration, getFormat, logStatus } from './utils.ts';

/**
 * Creates an Astro integration that captures screenshots of specified pages
 * during the `astro:build:done` lifecycle event.
 *
 * @param config - Integration configuration, including page mappings, defaults,
 * and Puppeteer settings.
 * @returns The configured Astro integration.
 */
export default function snapshot(
	config: SnapshotIntegrationConfig,
): AstroIntegration {
	// Resolved config options
	const pages = config.pages;
	const defaults = {
		...config.defaults,
	} as const;
	const launchOptions = {
		headless: true,
		...config.launchOptions,
	} as const;
	const port = config.port ?? 4322;

	let astroConfig: AstroConfig;
	let rootDir: string;

	/**
	 * Merges per-page configuration with defaults and resolves
	 * the final screenshot configuration.
	 *
	 * @param pageConfig - Configuration for a specific page.
	 * @returns Fully resolved configuration for Puppeteer.
	 */
	const resolveScreenshotConfig = (pageConfig: ScreenshotConfig) => {
		const outputPath = pageConfig.outputPath;

		return {
			// Or operator is used to ignore 0
			width: pageConfig.width || defaults.width || 1200,
			height: pageConfig.height || defaults.height || 630,
			overwrite: pageConfig.overwrite ?? defaults.overwrite ?? false,
			goToOptions: {
				waitUntil: 'networkidle2',
				...defaults.gotoOptions,
				...pageConfig.gotoOptions,
			} as const,
			outputPath,
			screenshotOptions: {
				path: outputPath,
				type: getFormat(outputPath),
				fullPage: false,
				...defaults.screenshotOptions,
				...pageConfig.screenshotOptions,
			} as const,
		};
	};

	/**
	 * Handles the `astro:config:done` lifecycle event.
	 * Stores the Astro configuration and root directory for later use.
	 *
	 * @param param0 - Object containing the resolved Astro config.
	 */
	const handleConfigDone: HandleConfigDone = ({ config }) => {
		astroConfig = config;
		rootDir = fileURLToPath(astroConfig.root);
	};

	/**
	 * Handles the `astro:build:done` lifecycle event.
	 * Launches a local preview server and uses Puppeteer to generate
	 * screenshots for all configured pages.
	 *
	 * @param param0 - Object containing the Astro logger instance.
	 */
	const handleBuildDone: HandleBuildDone = async ({ logger }) => {
		const startTime = performance.now();

		logger.info('🔭 Integration loaded.');

		const pageEntries = Object.entries(pages);

		if (pageEntries.length === 0) {
			logger.warn(
				'No pages configured for screenshot generation. Skipping...',
			);

			return;
		}
		// Start local server to render pages
		const previewServer = await preview({
			root: rootDir,
			server: { port },
		});

		// Launch Puppeteer
		const browser = await launch(launchOptions);

		logger.info('🔭 Generating screenshots...');

		logger.label = '';

		try {
			for (const [pagePath, screenshotConfigs] of pageEntries) {
				const normalizedPagePath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
				const pageUrl = `http://localhost:${port}${normalizedPagePath}` as const;

				for (const screenshotConfig of screenshotConfigs) {
					const { width, height, overwrite, goToOptions, outputPath, screenshotOptions } = resolveScreenshotConfig(
						screenshotConfig,
					);

					const absoluteOutputPath = resolve(rootDir, outputPath);
					const relativePath = relative(rootDir, absoluteOutputPath);

					const doesFileExist = await fileExists(absoluteOutputPath);

					if (doesFileExist && !overwrite) {
						logStatus(logger, normalizedPagePath, relativePath, 'skipped');

						continue;
					}

					// Ensure output directory exists
					await mkdir(dirname(absoluteOutputPath), { recursive: true });

					// Create page and take screenshot
					const page = await browser.newPage();

					await page.setViewport({ width, height });
					await page.goto(pageUrl, goToOptions);
					await page.screenshot(screenshotOptions);
					await page.close();

					logStatus(logger, normalizedPagePath, relativePath, doesFileExist && overwrite ? 'overwritten' : undefined);
				}
			}
		} finally {
			await browser.close();
			await previewServer.stop();
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
