import { type MarkdownApplication, MarkdownPageEvent } from 'typedoc-plugin-markdown';
import { ReflectionKind } from 'typedoc/models';
import type { Reflection } from 'typedoc';

/**
 * Registers a Markdown page hook that injects a frontmatter description
 * for each generated API page.
 *
 * @param app - The TypeDoc Markdown application instance to extend.
 */
export function load(app: MarkdownApplication) {
	app.renderer.on(
		MarkdownPageEvent.BEGIN,
		(page: MarkdownPageEvent) => {
			// Trust me bro (https://typedoc.org/api/types/RouterTarget.html)
			const { name, kind } = page.model as Reflection;
			const readableKind = ReflectionKind.singularString(kind).toLowerCase();
			const description = `API documentation for the ${name} ${readableKind}.`;

			if (page.frontmatter) {
				page.frontmatter.description = description;
			}
		},
	);
}
