import type {
	LanguageFileDefinition,
	NormalizedReport,
	ReportMessageData,
	RuleReport,
	RuleRuntime,
	RuleVisitor,
} from "@flint.fyi/core";

import * as ts from "typescript";

import type { TypeScriptServices } from "./language.js";
import type { TSNodesByName } from "./nodes.js";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { formatDiagnostic } from "./formatDiagnostic.js";
import { getFirstEnumValues } from "./getFirstEnumValues.js";
import { normalizeRange } from "./normalizeRange.js";

const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

export function createTypeScriptFileFromProgram(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileDefinition<TSNodesByName, TypeScriptServices> {
	return {
		cache: {
			dependencies: [
				// TODO: Add support for multi-TSConfig workspaces.
				// https://github.com/JoshuaKGoldberg/flint/issues/64 & more.
				"tsconfig.json",

				...collectReferencedFilePaths(program, sourceFile),
			],
		},
		getDiagnostics() {
			return ts
				.getPreEmitDiagnostics(program, sourceFile)
				.map((diagnostic) => ({
					code: `TS${diagnostic.code}`,
					text: formatDiagnostic({
						...diagnostic,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						length: diagnostic.length!,
						message: ts.flattenDiagnosticMessageText(
							diagnostic.messageText,
							"\n",
						),
						name: `TS${diagnostic.code}`,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						start: diagnostic.start!,
					}),
				}));
		},
		async runRule<
			MessageId extends string,
			FileContext extends object | undefined,
		>(
			runtime: RuleRuntime<
				TSNodesByName,
				MessageId,
				TypeScriptServices,
				FileContext
			>,
			messages: Record<string, ReportMessageData>,
		): Promise<NormalizedReport[]> {
			const reports: NormalizedReport[] = [];

			const services = {
				program,
				sourceFile,
				typeChecker: program.getTypeChecker(),
			};

			const fileContext = await (runtime.fileSetup?.(services) as Promise<
				false | object | undefined
			>);
			if (fileContext === false) {
				return [];
			}

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
						range: normalizeRange(report.range, sourceFile),
					});
				},
				...fileContext,
			};

			if (!runtime.visitors) {
				return reports;
			}

			const { visitors } = runtime;
			const visit = (node: ts.Node) => {
				// TODO: There's got to be a better way to type visitors so all this casting isn't necessary.
				const visitor = visitors[
					NodeSyntaxKinds[node.kind] as keyof typeof visitors
				] as
					| RuleVisitor<typeof node, MessageId, TypeScriptServices>
					| undefined;

				visitor?.(node, context);

				node.forEachChild(visit);
			};

			visit(sourceFile);

			return reports;
		},
	};
}
