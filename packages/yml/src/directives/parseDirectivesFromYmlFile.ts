import { DirectivesCollector } from "@flint.fyi/core";
import * as yamlParser from "yaml-unist-parser";

export function parseDirectivesFromYmlFile(
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
			selection,
			type,
		);
	}

	return collector.collect();
}
