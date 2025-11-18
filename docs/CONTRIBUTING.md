# 🤝 Contributing

Thanks for your interest in contributing to **astro-snapshot**! This document provides guidelines and instructions for
contributing to the project.

## Reporting Issues

You can [create an issue](https://github.com/twocaretcat/astro-snapshot/issues) to request a new feature or report a
problem with the project. Make sure a similar issue doesn't already exist.

### Feature Requests

For feature requests, please describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered
- Examples of how the feature would be used

### Bug Reports

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Your JS runtime and version (ex. Node 24.1.1)
- Code samples or test cases demonstrating the issue

### Questions

If you have a question about the project, please start a [discussion].

### Security Vulnerabilities

See the [security policy](SECURITY.md) for details on reporting security vulnerabilities.

### Pull Requests

Issues with the `🚦 ready` label are ready to be worked on. If you comment on an issue, I can assign it to you.

Issues with the `🚦 needs triage` label generally need some more information before they can be worked on, but if you
start a [discussion] about it or leave a comment on the issue, I can likely get it ready for you.

If an issue is unclear or you have any questions about how a feature should be implemented, reach out before making any
changes so we can discuss the best way to do it.

## Development Workflow

### Prerequisites

- [Deno](https://deno.land/)
- [Git](https://git-scm.com/) for version control
- A code editor ([VS Codium](https://vscodium.com/) with the
  [Deno extension](https://open-vsx.org/extension/denoland/vscode-deno) is recommended)

### Getting Started

Here's a quick example of how to contribute a new feature or bug fix:

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/astro-snapshot.git
   cd astro-snapshot
   ```

2. Create a new branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. Make your changes in the `src/` directory
4. Write or update tests as needed
5. Run the full check suite:

   ```bash
   deno check
   deno lint
   deno fmt
   deno task test
   ```

6. Commit your changes:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. Push and create a pull request:

   ```bash
   git push origin feat/your-feature-name
   ```

See below for more details.

## Checking

We use Deno's built-in tools for checking code quality. Make sure to run these checks before submitting a pull request.

### Checking TypeScript Types

```bash
deno check
```

### Formatting Code

```bash
deno fmt          # Format all files
deno fmt --check  # Check formatting without modifying files
```

### Linting Code

```bash
deno lint
```

## Testing

There are currently no tests.

## Building

We have a custom script to build the package for npm. This script uses [dnt] (Deno to Node Transform) to generate a
Node.js-compatible package in the [npm/](../npm/) directory. No build step is required for JSR.

### Building for npm

Generate a Node.js-compatible package:

```bash
deno task build:npm        # Build with version from deno.json
deno task build:npm 0.2.0  # Build with specific version
```

## Publishing

The package is published to JSR as [@twocaretcat/astro-snapshot](https://jsr.io/@twocaretcat/astro-snapshot) and to npm
as [@twocaretcat/astro-snapshot](https://www.npmjs.com/package/@twocaretcat/astro-snapshot).

Publishing is automated with [Semantic Release](https://semantic-release.gitbook.io/semantic-release) using the
[publish workflow](../.github/workflows/publish.yml). Semantic Release is configured in
[release.config.js](../release.config.js).

### Workflow

1. Pushes to the `main` branch will trigger the workflow, where we run Semantic Release
2. Commits will trigger new releases based on their type. We use the
   [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/) preset. For example:

   - `feat!:` - Major version bump
   - `feat:` - Minor version bump
   - `fix:` - Patch version bump
   - `docs:` - No version bump

3. If a commit triggers a release, we will:
   1. Update the version in `deno.json` using `deno task version <version>`, push the changes, and create a new tag
   2. Build the package for npm using `deno task build:npm`
   3. Publish the package to npm with `npm publish`
   4. Publish the package to JSR with `deno publish`
   5. Create a GitHub release with the release notes

### Updating the Version in [deno.json]

> [!IMPORTANT]
> You don't need to run this task manually. It is run automatically by the publish workflow to bump the version number
> before publishing.

Update the version field in [deno.json] with the provided value:

```bash
deno task version 1.0.0
```

## Code Style Guidelines

See the existing source for examples of how to write code that fits with the project's style.

### TypeScript Best Practices

- Use explicit type annotations for function parameters and return types
- Avoid `any` type unless absolutely necessary

### Formatting

- Use `deno fmt` or the Deno extension in your code editor and you should be good
- Compared to the defaults, this project uses tabs, single quotes, and a larger line width of 120 characters

### Documentation

- Add JSDoc comments for all exported functions and types
- Keep comments up-to-date with code changes
- If necessary, update the [README](../README.md) and any other applicable files in the [docs/](../docs/) directory

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

If you are making a breaking change, add an exclamation mark after the type and a `BREAKING CHANGE:` footer further
explaining the breaking changes for users. For example:

<!-- Example from https://www.conventionalcommits.org/en/v1.0.0/ | MIT -->

```txt
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

## Project Structure

The project is structured as follows:

<!-- Generated with `ls --tree -I node_modules -I .git --icon-theme=unicode -A --group-dirs=first` -->

```bash
📄 .editorconfig
📄 .gitignore
📄 deno.json                        # Deno config and task definitions
📄 deno.lock
📄 LICENSE
📄 package.json
📄 project-metadata.json
📄 README.md
📄 release.config.js                # Semantic Release config

📂 .
📂 .github
├── 📂 ISSUE_TEMPLATE
└── 📂 workflows
📂 .vscode
📂 docs                   # Additional documentation
📂 npm                    # Build output for npm
│                         # (auto-generated by the `build:npm` task)
├── 📂 esm                # ESM output
├── 📂 script             # CJS output
├── 📂 src                # Source code
📂 scripts                # Helper scripts
├── 📄 build-npm.ts       # Build script for npm
└── 📄 update-version.ts  # Script to update deno.json version
📂 src                    # Source code
├── 📄 index.ts           # Main module
├── 📄 types.ts           # Types
└── 📄 utils.ts           # Utility functions
📄 .editorconfig
📄 .gitignore
📄 deno.json              # Deno config and task definitions
📄 deno.lock
📄 LICENSE
📄 package.json
📄 project-metadata.json
📄 README.md
📄 release.config.js      # Semantic Release config
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project
[license](../LICENSE).

[dnt]: https://github.com/denoland/dnt
[discussion]: https://github.com/twocaretcat/astro-snapshot/discussions
[deno.json]: ../deno.json
