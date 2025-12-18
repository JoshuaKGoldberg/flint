import {
	createRuleRunner,
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	RuleContext,
	RuleVisitor,
	RuleVisitors,
} from "@flint.fyi/core";
import { visit } from "unist-util-visit";
import * as yamlParser from "yaml-unist-parser";

import type { YamlServices } from "./language.js";
import type { YamlNodesByName } from "./nodes.js";

// Eventually, it might make sense to use a native speed Yaml parser...
// However, the unist ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createYamlFile(sourceText: string) {
	const root = yamlParser.parse(sourceText);
	const sourceFileText = { text: sourceText };

	const languageFile: LanguageFileDefinition<YamlNodesByName, YamlServices> = {
		runRule: createRuleRunner<YamlNodesByName, YamlServices>(
			{
				root,
			},
			<MessageId extends string, Options>(
				visitors: RuleVisitors<
					YamlNodesByName,
					MessageId,
					YamlServices,
					Options
				>,
				context: RuleContext<MessageId> & YamlServices,
				options: Options,
			) => {
				visit(root, (node) => {
					const visitor = visitors[node.type] as
						| RuleVisitor<typeof node, MessageId, YamlServices, Options>
						| undefined;

					visitor?.(node, context, options);
				});
			},
			(range) => ({
				begin: getColumnAndLineOfPosition(sourceFileText, range.begin),
				end: getColumnAndLineOfPosition(sourceFileText, range.end),
			}),
		),
	};

	return { languageFile, root };
}
