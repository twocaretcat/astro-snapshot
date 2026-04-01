/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ['main'],
	repositoryUrl: 'https://github.com/twocaretcat/astro-snapshot',
	tagFormat: 'v${version}',
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
			},
		],
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'conventionalcommits',
			},
		],
		[
			'@semantic-release/exec',
			{
				prepareCmd: 'deno task version ${nextRelease.version}',
				publishCmd: 'deno task "publish:*"',
			},
		],
		[
			'@semantic-release/git',
			{
				assets: ['deno.json'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		'@semantic-release/github',
	],
};
