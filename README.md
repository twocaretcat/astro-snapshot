<!-- Project Header -->
<div align="center">
<img class="projectLogo" src="docs/icon.svg" alt="Project logo" title="Project logo" width="256">
<h1 class="projectName">Astro Snapshot</h1>
<p class="projectBadges">
	<img src="https://johng.io/badges/category/Plugin.svg" alt="Project category" title="Project category">
	<img src="https://img.shields.io/github/languages/top/twocaretcat/astro-snapshot.svg" alt="Language" title="Language">
	<img src="https://img.shields.io/github/repo-size/twocaretcat/astro-snapshot.svg" alt="Repository size" title="Repository size">
	<a href="LICENSE"><img src="https://img.shields.io/github/license/twocaretcat/astro-snapshot.svg" alt="Project license" title="Project license"/></a>
	<a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release" alt="Semantic Release" title="Semantic Release"/></a>
</p>
<p class="projectBadges status">
	<a href="https://github.com/twocaretcat/astro-snapshot/releases/latest"><img src="https://img.shields.io/github/v/release/twocaretcat/astro-snapshot.svg" alt="Latest release" title="Latest release"/></a>
	<a href="https://jsr.io/@twocaretcat/astro-snapshot"><img src="https://jsr.io/badges/@twocaretcat/astro-snapshot" alt="View package on JSR" title="View package on JSR" /></a>
	<a href="https://jsr.io/@twocaretcat/astro-snapshot"><img src="https://jsr.io/badges/@twocaretcat/astro-snapshot/score" alt="View package on JSR" title="View package on JSR" /></a>
	<a href="https://www.npmjs.com/package/@twocaretcat/astro-snapshot"><img src="https://img.shields.io/npm/v/@twocaretcat/astro-snapshot" alt="View package on npmjs" title="View package on npmjs"/></a>
</p>
<p class="projectDesc">
	An Astro integration for generating screenshots of your pages automatically at build time
</p>
<br/>
</div>

## 👋 About

Generate screenshots of your [Astro] pages automatically at build time with **Astro Snapshot**. Perfect for creating
social images, content previews, dynamic icons, and more!

This integration was inspired by [astro-selfie] and a similar plugin I wrote for [Gatsby] called
[Gatsby Plugin: Component to Image]. Compared to astro-selfie, this integration exposes a lot more configuration options
which allow you to completely customize how images are generated.

### Features

- **🧩 Framework agnostic**: Generate one or more images from any valid Astro page
  - Unlike other integrations for generating social images, not limited to preset layouts
  - Unlike [Satori], not limited to certain types of JSX elements or CSS properties
  - Use whatever front-end framework you want
- **📸 Customizable outputs**: Full control over the generated images
  - Generate multiple images per page with different configurations
  - Save images to `public`, `dist`, `src`, or any other directory
  - Save PNG, JPEG, or WebP images, with the format automatically detected from the output filename
  - Save images at any resolution
  - Choose whether to overwrite existing images or skip them
- ⚙️ **Flexible configuration**: Advanced options for power users
  - Define global defaults to keep configs minimal and override them on a per-image basis
  - Pass through options directly to [Puppeteer] for precise control of the browser, viewport, and screenshot generation
    process
- 🔧 **TypeScript support**: Full type safety for all options and functions
  - Import types from the package to make sure your config is correct
  - Install the package from JSR for use with TypeScript-native runtimes like Deno

### Use cases

- **🏞️ Social images**: Use your existing front-end components to generate [Open Graph] images and/or Twitter cards for
  your blog posts or other content
- **📰 Content previews**: Generate screenshots of your website for use in documentation, marketing materials, etc.
- **🖼️ Favicons**: Dynamically generate favicons for your website

### How it works

> [!IMPORTANT]
> Note that, because this plugin runs _**after**_ the build completes, you will not be able to import the generated
> images into your components or perform any further operations with them in the same build cycle.
>
> You can, however, use them in the next build, provided they are not overwritten. If you do this, make sure to account
> for the images not existing the first time you perform a build (i.e. use a placeholder image or catch errors from
> `import` statements).

Here's a high-level overview of how the integration works:

1. After the Astro build completes, we launch a local preview server to serve the static files
2. Then, we use [Puppeteer] to:
   1. launch a headless browser
   2. navigate to the pages you configured
   3. take screenshots of each one and save them to the filesystem as images

## 📦 Installation

> [!NOTE]
> Some package managers may block Puppeteer's install scripts. Refer to the [troubleshooting](#troubleshooting) section
> if you run into this issue.

This package is available on both [JSR](https://jsr.io/@twocaretcat/astro-snapshot) and
[npm](https://www.npmjs.com/package/@twocaretcat/astro-snapshot). It also supports the `astro add` command to update
your `astro.config.js` automatically.

### Automatic (w/ `astro add`)

We can use the Astro CLI to install the integration automatically using your preferred package manager:

<details>
<summary>🦕 Deno</summary>

```bash
deno run -A astro add astro-snapshot
```

</details>

<details>
<summary>🥖 Bun</summary>

```bash
bunx astro add astro-snapshot
```

</details>

<details>
<summary>🟢 npm</summary>

```bash
npx astro add astro-snapshot
```

</details>

<details>
<summary>🟧 pnpm</summary>

```bash
pnpm astro add astro-snapshot
```

</details>

<details>
<summary>🧶 yarn</summary>

```bash
yarn astro add astro-snapshot
```

</details>

<details>
<summary>🖇 vlt</summary>

```bash
vlt astro add astro-snapshot
```

</details>

> [!NOTE]
> This grabs the package from npm. If you want to use the JSR version, you will need to install it manually instead.

If you run into any issues, try the manual installation steps below.

### Manual

#### 1. Install

First, install the package using your preferred package manager:

<details>
<summary>🦕 Deno</summary>

```bash
deno add jsr:@twocaretcat/astro-snapshot     # JSR (recommended)
```

```bash
deno add npm:@twocaretcat/astro-snapshot     # npm
```

</details>

<details>
<summary>🥖 Bun</summary>

```bash
bunx jsr add @twocaretcat/astro-snapshot     # JSR
```

```bash
bun add @twocaretcat/astro-snapshot          # npm
```

</details>

<details>
<summary>🟢 npm</summary>

```bash
npx jsr add @twocaretcat/astro-snapshot      # JSR
```

```bash
npm install @twocaretcat/astro-snapshot      # npm
```

</details>

<details>
<summary>🟧 pnpm</summary>

```bash
pnpm i jsr:@twocaretcat/astro-snapshot       # JSR
```

```bash
pnpm add @twocaretcat/astro-snapshot         # npm
```

</details>

<details>
<summary>🧶 yarn</summary>

```bash
yarn add jsr:@twocaretcat/astro-snapshot     # JSR
```

```bash
yarn add @twocaretcat/astro-snapshot         # npm
```

</details>

<details>
<summary>🖇 vlt</summary>

```bash
vlt install jsr:@twocaretcat/astro-snapshot  # JSR
```

```bash
vlt install @twocaretcat/astro-snapshot      # npm
```

</details>

> [!TIP]
> You can choose whether you want to install the package from JSR or npm. JSR has some advantages if you're using
> TypeScript or Deno:
>
> - It ships typed, modern ESM code by default
> - No need for separate type declarations
> - Faster, leaner installs without extraneous files

#### 2. Configure

Then, apply the integration to your `astro.config.*` file using the integrations property:

```diff
// astro.config.mjs
import { defineConfig } from 'astro/config';
+import snapshot from 'astro-snapshot';

export default defineConfig({
	// ...
-  integrations: [],
+  integrations: [snapshot()],
});
```

## 🕹️ Usage

### Configure the Integration

Add the integration to your `astro.config.mjs` or `astro.config.ts` file and pass in an object to configure it like so:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

export default defineConfig({
	integrations: [
		snapshot({
			defaults: {},
			pages: {
				// Single screenshot for homepage
				'/': [
					{
						outputPath: 'public/og/home.png',
					},
				],
				// Multiple screenshots for about page (different sizes)
				'/about': [
					{
						outputPath: 'public/og/about-og.png',
						width: 1200,
						height: 630,
					},
					{
						outputPath: 'public/og/about-square.jpg',
						width: 1080,
						height: 1080,
					},
					{
						outputPath: 'public/og/about-twitter.png',
						width: 1200,
						height: 675,
					},
				],
			},
		}),
	],
});
```

The `defaults` object is optional and can be used to set default values for all screenshots.

> [!NOTE]
> Input paths must reference a valid Astro page on your site. If not, you'll get a screenshot of a 404 page.

The `pages` object is required. It maps URL paths to an array of screenshot configurations.

Each screenshot configuration must have an `outputPath` property. Image file formats are determined automatically by
their output filenames. All other properties are optional.

See the section below for more configuration examples. For a real-world example, check out the
[astro.config.mjs](https://github.com/twocaretcat/Tally/blob/c09b17f083549bcec57510194b4fe1e6d06b627e/astro.config.ts)
for [Tally]. Tally uses this integration to generate social images for the site in multiple languages and aspect ratios.

## 🤖 Advanced Usage

### Kitchen Sink

Here's an example with all available configuration options:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

export default defineConfig({
	integrations: [
		snapshot({
			// Pages to screenshot (required)
			pages: {
				'/': [
					{
						outputPath: 'public/og/home.png',
						width: 1200, // Viewport width (default: 1200)
						height: 630, // Viewport height (default: 630)
						overwrite: true, // Overwrite existing screenshots (default: false)

						// Puppeteer page.goto() options
						gotoOptions: {
							waitUntil: 'networkidle0',
							timeout: 30000,
						},

						// Puppeteer page.screenshot() options
						screenshotOptions: {
							quality: 95, // For jpeg only
							fullPage: false,
							clip: { // Capture specific region
								x: 0,
								y: 0,
								width: 1200,
								height: 630,
							},
						},

						// Puppeteer page.setViewport() options
						setViewportOptions: {
							deviceScaleFactor: 2, // Higher resolution screenshots
							isMobile: false,
							hasTouch: false,
							isLandscape: true,
						},
					},
				],
			},

			// Default config for all screenshots (optional)
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

			// Port for preview server (default: 4322)
			port: 4322,

			// Puppeteer launch options
			launchOptions: {
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			},
		}),
	],
});
```

Several properties exist so that you can pass options directly to Puppeteer for fine-grained control:

- `gotoOptions` - [Puppeteer `page.goto()` options](https://pptr.dev/api/puppeteer.page.goto)
- `setViewportOptions` - [Puppeteer `page.setViewport()` options](https://pptr.dev/api/puppeteer.page.setviewport)
- `screenshotOptions` - [Puppeteer `page.screenshot()` options](https://pptr.dev/api/puppeteer.page.screenshot)
- `launchOptions` - [Puppeteer `puppeteer.launch()` options](https://pptr.dev/api/puppeteer.browserlauncher.launch)

### TypeScript

Using TypeScript? Import the `Config` type to get type checking:

```js
// astro.config.ts
import { defineConfig } from 'astro/config';
import snapshot, { type Config } from 'astro-snapshot';

const ASTRO_SNAPSHOT_CONFIG: Config = {
	pages: {
		'/': [
			{
				// ERROR: Type '"public/og/home.bmp"' is not assignable to type '`${string}.png` | `${string}.jpeg` | `${string}.webp`'.
				outputPath: 'public/og/home.bmp',
			},
		]
	}
};

export default defineConfig({
	integrations: [
		snapshot(ASTRO_SNAPSHOT_CONFIG);
	]
});
```

### Multiple Formats for Social Media

> [!TIP]
> If you need to reference output paths in your pages, define the config in a common place and import it into your pages
> as needed. The integration doesn't provide any methods for getting the output paths, so you'll need to manage that
> yourself.

Generate optimized images for different platforms:

```js
// astro.config.mjs
const socialMediaSizes = {
	og: { width: 1200, height: 630 }, // OpenGraph
	twitter: { width: 1200, height: 600 }, // Twitter
	linkedin: { width: 1200, height: 627 }, // LinkedIn
	instagram: { width: 1080, height: 1080 }, // Instagram
};

export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/': Object.entries(socialMediaSizes).map(([platform, dims]) => [{
					outputPath: `public/social/${platform}.png`,
					...dims,
				}]),
			},
		}),
	],
});
```

### Dynamic Blog Post Screenshots

Generate screenshots for all blog posts:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

// Get all blog post slugs (implement based on your setup)
const blogPosts = await getBlogPostSlugs();

// Create config for each blog post
const blogPages = Object.fromEntries(
	blogPosts.map((slug) => [
		`/blog/${slug}`,
		[
			{
				outputPath: `public/og/blog/${slug}.png`,
				width: 1200,
				height: 630,
			},
			{
				outputPath: `public/og/blog/${slug}-square.jpg`,
				width: 1080,
				height: 1080,
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

## 📚 API Reference

### `SnapshotIntegrationConfig`

| Property        | Type                                 | Required | Default              | Description                             |
| --------------- | ------------------------------------ | -------- | -------------------- | --------------------------------------- |
| `pages`         | `Record<string, ScreenshotConfig[]>` | ✅       | -                    | Map of page paths to screenshot configs |
| `defaults`      | `Partial<ScreenshotConfig>`          | ❌       | `{}`                 | Default config for all screenshots      |
| `launchOptions` | `PuppeteerLaunchOptions`             | ❌       | `{ headless: true }` | Puppeteer launch options                |
| `port`          | `number`                             | ❌       | `4322`               | Preview server port                     |

### `ScreenshotConfig`

| Property             | Type                                          | Required | Default                         | Description                       |
| -------------------- | --------------------------------------------- | -------- | ------------------------------- | --------------------------------- |
| `outputPath`         | `string`                                      | ✅       | -                               | Output path with format extension |
| `width`              | `number`                                      | ❌       | `1200`                          | Viewport width in pixels          |
| `height`             | `number`                                      | ❌       | `630`                           | Viewport height in pixels         |
| `gotoOptions`        | `GoToOptions`                                 | ❌       | `{ waitUntil: 'networkidle2' }` | Puppeteer goto options            |
| `screenshotOptions`  | `Omit<ScreenshotOptions, 'path' \| 'format'>` | ❌       | `{}`                            | Puppeteer screenshot options      |
| `setViewportOptions` | `Omit<Viewport, 'width' \| 'height'>`         | ❌       | `{}`                            | Puppeteer setViewport options     |

### Supported Formats

The format is automatically detected from the file extension in `outputPath`:

- `.png` - PNG format
- `.jpg` / `.jpeg` - JPEG format
- `.webp` - WebP format

## 🛟 Support

Need help? See the [support resources](https://github.com/twocaretcat/.github/blob/main/docs/SUPPORT.md) for information
on how to:

- request features
- report bugs
- ask questions
- report security vulnerabilities

### Troubleshooting

<details>
<summary><strong>Puppeteer can’t download a browser during installation</strong></summary>

Some package managers block post-install scripts (for example, when using `--ignore-scripts` or strict CI environments).
When this happens, Puppeteer will skip downloading a compatible browser, and the integration won’t be able to launch one
during snapshot generation.

To resolve this, configure your package manager to allow install scripts, install a compatible Chromium or Chrome binary
manually, or configure Puppeteer to use an existing browser. You can point to a custom binary using the
`PUPPETEER_EXECUTABLE_PATH` environment variable or the `launchOptions.executablePath` option.

</details>

<details>
<summary><strong>Browser fails to launch in CI due to Linux sandbox restrictions</strong></summary>

In many container-based CI environments, the Linux sandbox required by Chromium is unavailable. As a result, Puppeteer
may fail to start with messages such as `No usable sandbox!`.

To fix this, refer to Puppeteer’s instructions on how to
[configure a sandbox for Chrome on Linux](https://pptr.dev/troubleshooting#setting-up-chrome-linux-sandbox).

> [!CAUTION]
> Alternatively, you can also disable the sandbox entirely by providing additional Chromium flags in
> `launchOptions.args`:
>
> ```js
> // astro.config.mjs
> export default defineConfig({
>   integrations: [
>     snapshot({
>       launchOptions: {
>         args: ['--no-sandbox', '--disable-setuid-sandbox'];
>       },
>       // ...
>     }),
>   ],
> });
> ```
>
> The sandbox exists to prevent malicious websites from gaining elevated privileges on your system, so disabling it is
> not recommended for production environments.

Alternatively, run your build inside a base image that includes proper sandbox support, like the official
Chrome/Chromium images.

</details>

<details>
<summary><strong>Screenshots appear blank or missing styles</strong></summary>

This usually occurs when resources haven’t finished loading before the snapshot is taken. Adjusting the timing of page
navigation can help ensure all assets render correctly.

You can modify `gotoOptions.waitUntil` to values such as `networkidle2`, `networkidle0`, or `load`, or increase the
timeout to give the page more time to fully render:

```js
// astro.config.mjs
export default defineConfig({
	integrations: [
		snapshot({
			pages: {
				'/dashboard': [
					{
						outputPath: 'public/og/dashboard.png',
						gotoOptions: {
							waitUntil: 'networkidle0', // Wait for all network requests
							timeout: 60000, // Increase timeout
						},
					},
				],
			},
		}),
	],
});
```

</details>

<details>
<summary><strong>Routes return 404 or do not match the expected paths</strong></summary>

If the preview server can’t serve a configured route, the screenshot will fail or capture an error page. This often
happens when the route path in your config doesn’t match the output of your built site.

Double-check that your configured paths align with the final build output, and ensure the integration runs after your
site has fully completed its build process.

</details>

<details>
<summary><strong>Output files are not written or directories are missing</strong></summary>

While the integration creates necessary directories automatically, certain environments—especially CI filesystems—may
impose write restrictions. This can prevent screenshots from being saved.

Verify that the target directory is writable and not mounted as read-only. On CI systems, ensure your working directory
permits file creation before running the build.

</details>

## 🤝 Contributing

Want to help out? Pull requests are welcome for:

- feature implementations
- bug fixes
- translations
- documentation
- tests

See the [contribution guide](../../contribute) for more details.

## 🧾 License

Copyright © 2025 [John Goodliff](https://johng.io/r/astro-snapshot) ([@twocaretcat](https://github.com/twocaretcat)).

This project is licensed under the MIT license. See the [license](LICENSE) for more details.

We are not affiliated with or endorsed by Astro.

## 🖇️ Related

### Recommended

Other projects you might like:

- **👤 [Gatsby Plugin: Component to Image]**: A similar image generation plugin for the Gatsby framework.

### Used By

Notable projects that depend on this one:

- **👤 [Tally]**: A free online tool to count the number of characters, words, paragraphs, and lines in your text.
  **Tally** uses this integration to generate social images.

### Alternatives

Similar projects you might want to use instead:

- **🌐 [astro-selfie]**: A similar integration that automatically generates images for every page.

## 💕 Funding

Find this project useful? [Sponsoring me](https://johng.io/funding) will help me cover costs and **_commit_** more time
to open-source.

If you can't donate but still want to contribute, don't worry. There are many other ways to help out, like:

- 📢 reporting (submitting feature requests & bug reports)
- 👨‍💻 coding (implementing features & fixing bugs)
- 📝 writing (documenting & translating)
- 💬 spreading the word
- ⭐ starring the project

I appreciate the support!

[Astro]: https://astro.build/
[Gatsby]: https://www.gatsbyjs.com/
[astro-selfie]: https://github.com/vadimdemedes/astro-selfie
[Open Graph]: https://ogp.me/
[Satori]: https://github.com/vercel/satori
[Puppeteer]: https://pptr.dev/
[Gatsby Plugin: Component to Image]: https://github.com/twocaretcat/gatsby-plugin-component-to-image
[Tally]: https://tally.johng.io/r/astro-snapshot
