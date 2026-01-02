import { base } from "../base.js";
import { getScriptFileExtension } from "./eslint/getScriptFileExtension.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintPerfectionist.ts
const blockESLintPerfectionist = base.createBlock({
	about: { name: "ESLint Perfectionist Plugin" },
	produce({ options }) {
		return { addons: [blockESLint({
			extensions: [{
				extends: [`perfectionist.configs["recommended-natural"]`],
				files: [getScriptFileExtension(options)],
				settings: { perfectionist: {
					partitionByComment: true,
					type: "natural"
				} }
			}],
			imports: [{
				source: "eslint-plugin-perfectionist",
				specifier: "perfectionist"
			}]
		})] };
	}
});

//#endregion
export { blockESLintPerfectionist };
//# sourceMappingURL=blockESLintPerfectionist.js.map