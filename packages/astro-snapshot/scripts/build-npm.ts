import { build, emptyDir } from '@deno/dnt';
import deno from '../deno.json' with { type: 'json' };

const AUTHOR = {
	username: 'twocaretcat',
	domain: 'johng.io',
} as const;
const PACKAGE_NAME = 'astro-snapshot' as const;
const REPO_URL = `https://github.com/${AUTHOR.username}/${PACKAGE_NAME}` as const;
const dir = {
	src: './src',
	out: './npm',
} as const;

await emptyDir(dir.out);
await build({
	entryPoints: [
		{
			name: '.',
			path: `${dir.src}/index.ts`,
		},
	],
	outDir: dir.out,
	compilerOptions: {
		lib: ['ES2022'],
		target: 'ES2022',
	},
	shims: {},
	test: false,
	package: {
		name: deno.name,
		version: Deno.args[0] ?? deno.version,
		description:
			'An Astro integration for generating screenshots of your pages automatically at build time. Perfect for creating social images, content previews, dynamic icons, and more!',
		keywords: [
			'withastro',
			'astro',
			'astro-integration',
			'screenshot',
			'puppeteer',
			'puppeteer-screenshot',
			'social-preview',
			'social-images',
			'og-images',
			'preview',
			'image',
			'images',
			'seo',
			'typescript',
		],
		license: 'MIT',
		author: {
			name: 'John Goodliff',
			url: `https://${AUTHOR.domain}`,
		},
		repository: {
			type: 'git',
			url: `git+${REPO_URL}.git`,
		},
		homepage: `https://${PACKAGE_NAME}.${AUTHOR.domain}`,
		bugs: `${REPO_URL}/issues`,
		funding: [
			{
				type: 'individual',
				url: `https://${AUTHOR.domain}/funding`,
			},
			{
				type: 'GitHub Sponsors',
				url: `https://github.com/sponsors/${AUTHOR.username}`,
			},
			{
				type: 'Patreon',
				url: `https://patreon.com/${AUTHOR.username}`,
			},
			{
				type: 'Brave Creators',
				url: 'https://publishers.basicattentiontoken.org/en/c/johng',
			},
		],
	},
	postBuild() {
		Deno.copyFileSync('../../LICENSE', `${dir.out}/LICENSE`);
		Deno.copyFileSync('../../README.md', `${dir.out}/README.md`);
	},
});
