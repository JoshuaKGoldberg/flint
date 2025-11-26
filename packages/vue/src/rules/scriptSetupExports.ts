import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { vueLanguage } from "../language.js";

export default vueLanguage.createRule({
	about: {
		description:
			"Reports use of ES module exports inside a <script setup> block.",
		id: "scriptSetupExports",
		preset: "logical",
	},
	messages: {
		forbidden: {
			primary: "`<script setup>` cannot contain ES module exports.",
			secondary: [
				"In `<script setup>`, all variables are automatically scoped and exposed to the template without needing exports.",
				"Using `export` breaks the compilation model and results in build-time errors or unexpected behavior.",
			],
			suggestions: [
				"Remove the `export` and declare the value normally inside `<script setup>`.",
				"If you need to export something from the SFC, move the export to a separate `<script>` block.",
			],
		},
	},
	setup(context) {
		const { vueServices } = context;
		if (vueServices == null) {
			return undefined;
		}

		const { scriptSetup } = vueServices.virtualCode.sfc;
		if (scriptSetup == null) {
			return undefined;
		}

		const reportExport = (exportKeywordStart: number) => {
			exportKeywordStart += scriptSetup.startTagEnd;
			vueServices.reportSfc({
				message: "forbidden",
				range: {
					begin: exportKeywordStart,
					end: exportKeywordStart + "export".length,
				},
			});
		};

		// https://github.com/vuejs/core/blob/25ebe3a42cd80ac0256355c2740a0258cdd7419d/packages/compiler-sfc/src/compileScript.ts#L675-L686
		// `export = ...` and `export default ...` are reported by vue-tsc
		for (const statement of scriptSetup.ast.statements) {
			if (ts.isExportDeclaration(statement) && !statement.isTypeOnly) {
				reportExport(statement.getStart(scriptSetup.ast));
			} else if (
				(ts.isVariableStatement(statement) ||
					ts.isEnumDeclaration(statement) ||
					ts.isClassDeclaration(statement) ||
					ts.isModuleDeclaration(statement) ||
					ts.isFunctionDeclaration(statement)) &&
				statement.modifiers != null
			) {
				let exportToken: null | ts.ExportKeyword = null;
				let hasDeclare = false;
				for (const m of statement.modifiers) {
					if (tsutils.isDeclareKeyword(m)) {
						hasDeclare = true;
						break;
					}
					exportToken ??= tsutils.isExportKeyword(m) ? m : null;
				}

				if (!hasDeclare && exportToken != null) {
					reportExport(exportToken.getStart(scriptSetup.ast));
				}
			}
		}

		return undefined;
	},
});
