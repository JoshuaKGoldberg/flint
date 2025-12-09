import {
	createRuleRunner,
	type LanguageFileDefinition,
	type RuleContext,
	type RuleVisitor,
	type RuleVisitors,
} from "@flint.fyi/core";
import * as ts from "typescript";

import type { JsonServices } from "./language.js";
import type { TSNodesByName } from "./nodes.js";

import { normalizeRange } from "./normalizeRange.js";

// TODO: Eventually, it might make sense to use a native speed JSON parser.
// The standard TypeScript language will likely use that itself.
// https://github.com/JoshuaKGoldberg/flint/issues/44
export function createTypeScriptJsonFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition<TSNodesByName, JsonServices> {
	const sourceFile = ts.parseJsonText(filePathAbsolute, sourceText);

	return {
		runRule: createRuleRunner<TSNodesByName, JsonServices>(
			{
				sourceFile,
			},
			<MessageId extends string, FileContext extends object>(
				visitors: RuleVisitors<
					TSNodesByName,
					MessageId,
					FileContext & JsonServices
				>,
				context: FileContext & JsonServices & RuleContext<MessageId>,
			) => {
				const visit = (node: ts.Node) => {
					const visitor = visitors[
						ts.SyntaxKind[node.kind] as keyof TSNodesByName
					] as RuleVisitor<typeof node, MessageId, unknown> | undefined;
					visitor?.(node, context);

					node.forEachChild(visit);
				};

				sourceFile.forEachChild(visit);
			},
			(range) => normalizeRange(range, sourceFile),
		),
	};
}
