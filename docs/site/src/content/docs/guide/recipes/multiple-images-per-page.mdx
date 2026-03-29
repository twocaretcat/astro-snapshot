---
title: Multiple Images per Page
description: Generate social media images for various platforms by taking multiple screenshots per page with different dimensions.
sidebar:
  order: 0
---

:::tip[Referencing Output Paths in Your Pages]
If you need to reference image output paths in your pages, define the config in a common place and import it into your pages as needed. The integration doesn't provide any methods for getting the output paths, so you'll need to manage that yourself.
:::

You can define multiple screenshots to be generated for a single page by setting an array of screenshot configurations
for a page in the `pages` object.

In this example, we use a shared size map to take multiple
screenshots for social media, each with their own output dimensions.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import snapshot from '@twocaretcat/astro-snapshot';

const socialSizes = {
	og: { width: 1200, height: 630 }, // OpenGraph
	twitter: { width: 1200, height: 600 }, // Twitter / X
	linkedin: { width: 1200, height: 627 }, // LinkedIn
	instagram: { width: 1080, height: 1080 }, // Instagram
};

export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/': Object.entries(socialSizes).map(([platform, dims]) => ({
					outputPath: `public/social/${platform}.png`,
					...dims,
				})),
			},
		}),
	],
});
```
