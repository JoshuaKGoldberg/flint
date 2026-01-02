import { base } from "../base.js";
import { blockRemoveFiles } from "./blockRemoveFiles.js";
import { blockPackageJson } from "./blockPackageJson.js";
import { blockRemoveWorkflows } from "./blockRemoveWorkflows.js";
import { blockRemoveDependencies } from "./blockRemoveDependencies.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintPackageJson.ts
const blockESLintPackageJson = base.createBlock({
	about: { name: "ESLint package.json Plugin" },
	produce() {
		return { addons: [blockESLint({
			extensions: [{
				extends: ["packageJson.configs.recommended"],
				files: ["package.json"]
			}],
			imports: [{
				source: "eslint-plugin-package-json",
				specifier: "packageJson"
			}]
		}), blockPackageJson({ properties: { scripts: { "lint:package-json": void 0 } } })] };
	},
	transition() {
		return { addons: [
			blockRemoveFiles({ files: [".npmpackagejsonlintrc*"] }),
			blockRemoveDependencies({ dependencies: ["npm-package-json-lint", "npm-package-json-lint-config-default"] }),
			blockRemoveWorkflows({ workflows: ["lint-package-json"] })
		] };
	}
});

//#endregion
export { blockESLintPackageJson };
//# sourceMappingURL=blockESLintPackageJson.js.map