import { DirectivesCollector } from "@flint.fyi/core";
import { Root } from "mdast";
import { visit } from "unist-util-visit";

export function parseDirectivesFromMarkdownFile(
	root: Root,
	sourceText: string,
) {
	const index =
		root.children.find((child) => child.position?.start.offset !== undefined)
			?.position?.start.offset ?? sourceText.length;
	const collector = new DirectivesCollector(index);

	visit(root, "html", (node) => {
		const regex = /<!--([\s\S]*?)-->/g;
		let commentMatch: null | RegExpExecArray;
		while ((commentMatch = regex.exec(node.value)) !== null) {
			const directiveMatch = /^\s*flint-(\S+)(?:\s+(.+))?/.exec(
				commentMatch[1],
			);
			if (!directiveMatch) {
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const position = node.position!;

			const [type, selection] = directiveMatch.slice(1);
			collector.add(
				{
					begin: {
						column: position.start.column,
						line: position.start.line,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						raw: position.start.offset!,
					},
					end: {
						column: position.end.column,
						line: position.end.line,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						raw: position.end.offset!,
					},
				},
				selection,
				type,
			);
		}
	});

	return collector.collect();
}
