---
title: TypeScript
description: Use the Config type for type-safe configuration.
sidebar:
  order: 3
---

Import the `Config` type to get full type checking and autocompletion for your integration config.

```diff lang="ts" title="astro.config.ts"
import { defineConfig } from 'astro/config';
import snapshot, { type Config } from '@twocaretcat/astro-snapshot';

const snapshotConfig: Config = {
	pages: {
		'/': [
			{
-				// Type error: '.bmp' is not a supported format
				outputPath: 'public/og/home.bmp',
			},
		],
	},
};

export default defineConfig({
	integrations: [snapshot(snapshotConfig)],
});
```
