---
title: Dynamic Pages
description: Generate screenshots for a dynamic set of pages such as blog posts using programmatically built config.
sidebar:
  order: 1
---

By building the `pages` config programmatically, you can generate screenshots for a dynamic set of pages such as blog
posts. This can be useful if you want to generate social preview images for each page on your site.

This example generates an OpenGraph image for each blog post.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import snapshot from '@twocaretcat/astro-snapshot';

// Replace with however you fetch your slugs (ex. a glob, a CMS call, etc.)
const blogPosts = await getBlogPostSlugs();

const blogPages = Object.fromEntries(
	blogPosts.map((slug) => [
		`/blog/${slug}`,
		[
			{
				outputPath: `public/og/blog/${slug}.png`,
				width: 1200,
				height: 630,
			},
		],
	]),
);

export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/': [{ outputPath: 'public/og/home.png' }],
				'/about': [{ outputPath: 'public/og/about.png' }],
				...blogPages,
			},
		}),
	],
});
```
