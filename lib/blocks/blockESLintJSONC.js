import { base } from "../base.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintJSONC.ts
const blockESLintJSONC = base.createBlock({
	about: { name: "ESLint JSONC Plugin" },
	produce() {
		return { addons: [blockESLint({
			extensions: [{
				extends: [`jsonc.configs["flat/recommended-with-json"]`],
				files: ["**/*.json"]
			}],
			imports: [{
				source: "eslint-plugin-jsonc",
				specifier: "jsonc"
			}]
		})] };
	}
});

//#endregion
export { blockESLintJSONC };
//# sourceMappingURL=blockESLintJSONC.js.map