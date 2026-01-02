import { base } from "../base.js";
import { getScriptFileExtension } from "./eslint/getScriptFileExtension.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintComments.ts
const blockESLintComments = base.createBlock({
	about: { name: "ESLint Comments Plugin" },
	produce({ options }) {
		return { addons: [blockESLint({
			extensions: [{
				extends: ["comments.recommended"],
				files: [getScriptFileExtension(options)]
			}],
			imports: [{
				source: "@eslint-community/eslint-plugin-eslint-comments/configs",
				specifier: "comments"
			}]
		})] };
	}
});

//#endregion
export { blockESLintComments };
//# sourceMappingURL=blockESLintComments.js.map