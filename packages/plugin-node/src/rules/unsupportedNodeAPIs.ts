import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

import { isDeclaredInNodeTypes } from "./utils/isDeclaredInNodeTypes.js";

const nodeAPIVersions: Partial<
	Record<string, { apis: string[]; version: string }>
> = {
	crypto: {
		apis: ["webcrypto"],
		version: "15.0.0",
	},
	fs: {
		apis: ["openAsBlob"],
		version: "14.0.0",
	},
	stream: {
		apis: ["Readable.toWeb", "Writable.toWeb"],
		version: "16.0.0",
	},
};

function getModuleName(moduleSpecifier: ts.Expression): string | undefined {
	if (!ts.isStringLiteral(moduleSpecifier)) {
		return undefined;
	}
	return moduleSpecifier.text.replace(/^node:/, "");
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Ensure Node.js built-in APIs are supported in the target Node.js version.",
		id: "unsupportedNodeAPIs",
		preset: "logical",
	},
	messages: {
		unsupportedAPI: {
			primary:
				"The `{{ moduleName }}.{{ apiName }}` API requires Node.js {{ version }} or higher.",
			secondary: [
				"Using APIs from newer Node.js versions may cause runtime errors in older environments.",
				"Ensure the target Node.js version in your package.json engines field supports this API.",
			],
			suggestions: [
				"Update the minimum Node.js version requirement",
				"Use alternative APIs compatible with older Node.js versions",
			],
		},
	},
	setup(context) {
		const moduleImports = new Map<string, string>();

		function checkAndReportAPI(
			moduleName: string,
			apiName: string,
			node: ts.Node,
		) {
			const versionInfo = nodeAPIVersions[moduleName];

			if (!versionInfo) {
				return;
			}

			if (versionInfo.apis.includes(apiName)) {
				context.report({
					data: {
						apiName,
						moduleName,
						version: versionInfo.version,
					},
					message: "unsupportedAPI",
					range: getTSNodeRange(node, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				ImportDeclaration(node: ts.ImportDeclaration) {
					const moduleName = getModuleName(node.moduleSpecifier);
					if (!moduleName || !nodeAPIVersions[moduleName]) {
						return;
					}

					if (node.importClause?.namedBindings) {
						if (ts.isNamespaceImport(node.importClause.namedBindings)) {
							const localName = node.importClause.namedBindings.name.text;
							moduleImports.set(localName, moduleName);
						} else if (ts.isNamedImports(node.importClause.namedBindings)) {
							for (const element of node.importClause.namedBindings.elements) {
								const localName = element.name.text;
								const importedName =
									element.propertyName?.text ?? element.name.text;

								// Check if the named import itself is a version-gated API
								// Report on the imported name (or alias if present)
								const reportNode = element.propertyName ?? element.name;
								checkAndReportAPI(moduleName, importedName, reportNode);

								moduleImports.set(localName, `${moduleName}.${importedName}`);
							}
						}
					}

					if (node.importClause?.name) {
						const localName = node.importClause.name.text;
						moduleImports.set(localName, moduleName);
					}
				},
				PropertyAccessExpression(
					node: ts.PropertyAccessExpression,
					{ typeChecker },
				) {
					if (
						!ts.isIdentifier(node.expression) ||
						!isDeclaredInNodeTypes(node.expression, typeChecker)
					) {
						return;
					}

					const baseName = node.expression.text;
					const propertyName = node.name.text;
					const moduleInfo = moduleImports.get(baseName);

					if (!moduleInfo) {
						return;
					}

					const moduleName = moduleInfo.split(".")[0];
					checkAndReportAPI(moduleName, propertyName, node.name);
				},
			},
		};
	},
});
