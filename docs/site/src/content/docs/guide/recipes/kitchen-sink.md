---
title: Kitchen Sink
description: See what's possible with Astro Snapshot using the full suite of available options.
sidebar:
  order: 4
---

Here's a configuration example using every available option.

```ts title="astro.config.ts"
snapshot({
	pages: {
		'/': [
			{
				outputPath: 'public/og/home.png',
				width: 1200,     // Viewport width in px (default: 1200)
				height: 630,     // Viewport height in px (default: 630)
				overwrite: true, // Overwrite if file already exists (default: false)

				// Passed to Puppeteer's page.goto()
				gotoOptions: {
					waitUntil: 'networkidle0',
					timeout: 30000,
				},

				// Passed to Puppeteer's page.screenshot()
				screenshotOptions: {
					quality: 95, // JPEG only
					fullPage: false,
					clip: {
						x: 0,
						y: 0,
						width: 1200,
						height: 630,
					},
				},

				// Passed to Puppeteer's page.setViewport()
				setViewportOptions: {
					deviceScaleFactor: 2,
					isMobile: false,
					hasTouch: false,
					isLandscape: true,
				},
			},
		],
	},

	// Defaults applied to all screenshots (optional)
	defaults: {
		width: 1200,
		height: 630,
		overwrite: true,
		gotoOptions: {
			waitUntil: 'networkidle2',
		},
		setViewportOptions: {
			deviceScaleFactor: 2,
		},
	},

	// Port used for the local static file server (default: 4322)
	port: 4322,

	// Passed to Puppeteer's launch()
	launchOptions: {
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required in some CI environments
	},
}),
```

See the [API Reference](/api-reference/interfaces/config) for full documentation of each option, and the
[Puppeteer docs](https://pptr.dev/api) for details on the pass-through options.
