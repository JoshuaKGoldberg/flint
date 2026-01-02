import { base } from "../base.js";
import { getScriptFileExtension } from "./eslint/getScriptFileExtension.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintJSDoc.ts
const blockESLintJSDoc = base.createBlock({
	about: { name: "ESLint JSDoc Plugin" },
	produce({ options }) {
		return { addons: [blockESLint({
			extensions: [{
				extends: [
					"jsdoc.configs[\"flat/contents-typescript-error\"]",
					"jsdoc.configs[\"flat/logical-typescript-error\"]",
					"jsdoc.configs[\"flat/stylistic-typescript-error\"]"
				],
				files: [getScriptFileExtension(options)]
			}],
			imports: [{
				source: "eslint-plugin-jsdoc",
				specifier: "jsdoc"
			}]
		})] };
	}
});

//#endregion
export { blockESLintJSDoc };
//# sourceMappingURL=blockESLintJSDoc.js.map