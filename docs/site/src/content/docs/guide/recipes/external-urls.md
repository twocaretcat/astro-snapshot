---
title: External URLs
description: Take screenshots of pages on external sites by passing http:// or https:// URLs as page keys.
sidebar:
  order: 2
---

Page keys that start with `http://` or `https://` are treated as external URLs so that you can capture pages outside of
your build.

Screenshots of third-party sites are especially useful for project showcases or link previews.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import snapshot from '@twocaretcat/astro-snapshot';

export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'https://example.com': [
					{
						outputPath: 'src/assets/example.jpg',
					},
				],
			},
		}),
	],
});
```

You can freely mix external URLs and local page paths in the same `pages` map. The local server is only started when at
least one local path is present.
