/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ['main'],
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
				publishCmd: 'deno task build:npm && cd npm && npm publish && cd .. && deno publish --allow-dirty',
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
