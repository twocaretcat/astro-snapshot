---
title: Puppeteer Customization
description: Capture retina-quality screenshots by passing through options directly to Puppeteer.
sidebar:
  order: 3
---

Astro Snapshot allow you to pass through options directly to Puppeteer for more control over the screenshot generation
process.

In this example, we use `deviceScaleFactor` to increase the pixel density for sharper images on high-DPI displays.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import snapshot from '@twocaretcat/astro-snapshot';

export default defineConfig({
	integrations: [
		snapshot({
			// Apply to all screenshots via defaults
			defaults: {
				setViewportOptions: {
					deviceScaleFactor: 2,
				},
			},
			pages: {
				'/': [{ outputPath: 'public/og/home.png' }],
			},
		}),
	],
});
```

There's several pass-through properties you can set for fine-grained control over the whole process.

| Option               | Relevant Puppeteer Method                                                     |
| -------------------- | ----------------------------------------------------------------------------- |
| `gotoOptions`        | [`page.goto()`](https://pptr.dev/api/puppeteer.page.goto)                     |
| `setViewportOptions` | [`page.setViewport()`](https://pptr.dev/api/puppeteer.page.setviewport)       |
| `screenshotOptions`  | [`page.screenshot()`](https://pptr.dev/api/puppeteer.page.screenshot)         |
| `launchOptions`      | [`puppeteer.launch()`](https://pptr.dev/api/puppeteer.browserlauncher.launch) |
