import { DirectivesCollector } from "@flint.fyi/core";
import type * as yamlParser from "yaml-unist-parser";

export function parseDirectivesFromYamlFile(
	root: yamlParser.Root,
	sourceText: string,
) {
	const index = root.children.at(0)?.position.start.offset ?? sourceText.length;
	const collector = new DirectivesCollector(index);

	for (const comment of root.comments) {
		const match = /^\s*flint-(\S+)(?:\s+(.+))?/.exec(comment.value);
		if (!match) {
			break;
		}

		const [type, selection] = match.slice(1);
		collector.add(
			{
				begin: {
					column: comment.position.start.column - 1,
					line: comment.position.start.line - 1,
					raw: comment.position.start.offset,
				},
				end: {
					column: comment.position.end.column - 1,
					line: comment.position.end.line - 1,
					raw: comment.position.end.offset,
				},
			},
			/* eslint-disable @typescript-eslint/no-non-null-assertion */
			// selection and type are guaranteed to be non-null by the regex match
			selection!,
			type!,
			/* eslint-enable @typescript-eslint/no-non-null-assertion */
		);
	}

	return collector.collect();
}
