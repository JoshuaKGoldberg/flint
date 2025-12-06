import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	NormalizedReport,
	type ReportMessageData,
	RuleReport,
	type RuleRuntime,
	type RuleVisitor,
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
		async runRule<MessageId extends string, FileContext extends object>(
			runtime: RuleRuntime<
				YamlNodesByName,
				MessageId,
				YamlServices,
				FileContext
			>,
			messages: Record<string, ReportMessageData>,
		): Promise<NormalizedReport[]> {
			const reports: NormalizedReport[] = [];

			const services = {
				root,
			};

			const context = {
				...services,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: messages[report.message],
						range: {
							begin: getColumnAndLineOfPosition(
								sourceFileText,
								report.range.begin,
							),
							end: getColumnAndLineOfPosition(sourceFileText, report.range.end),
						},
					});
				},
				...(await runtime.fileSetup?.(services)),
			};

			if (!runtime.visitors) {
				return reports;
			}

			const { visitors } = runtime;

			visit(root, (node) => {
				const visitor = visitors[node.type] as
					| RuleVisitor<typeof node, MessageId, YamlServices>
					| undefined;

				visitor?.(node, context);
			});

			return reports;
		},
	};

	return { languageFile, root };
}
