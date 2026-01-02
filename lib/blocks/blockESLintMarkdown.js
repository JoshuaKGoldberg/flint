import { base } from "../base.js";
import { blockRemoveFiles } from "./blockRemoveFiles.js";
import { blockRemoveWorkflows } from "./blockRemoveWorkflows.js";
import { blockRemoveDependencies } from "./blockRemoveDependencies.js";
import { blockESLint } from "./blockESLint.js";

//#region src/blocks/blockESLintMarkdown.ts
const blockESLintMarkdown = base.createBlock({
	about: { name: "ESLint Markdown Plugin" },
	produce() {
		return { addons: [
			blockESLint({
				extensions: [{
					extends: ["markdown.configs.recommended"],
					files: ["**/*.md"],
					rules: [{
						comment: "https://github.com/eslint/markdown/issues/294",
						entries: { "markdown/no-missing-label-refs": "off" }
					}]
				}],
				imports: [{
					source: "@eslint/markdown",
					specifier: "markdown"
				}]
			}),
			blockRemoveDependencies({ dependencies: [
				"eslint-plugin-markdown",
				"markdownlint",
				"markdownlint-cli"
			] }),
			blockRemoveFiles({ files: [".markdownlint*", ".markdownlintignore"] }),
			blockRemoveWorkflows({ workflows: ["lint_markdown", "lint_md"] })
		] };
	}
});

//#endregion
export { blockESLintMarkdown };
//# sourceMappingURL=blockESLintMarkdown.js.map