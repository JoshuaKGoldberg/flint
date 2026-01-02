import { base } from "../base.js";
import { blockGitHubActionsCI } from "./blockGitHubActionsCI.js";
import { blockPackageJson } from "./blockPackageJson.js";
import { blockDevelopmentDocs } from "./blockDevelopmentDocs.js";
import { blockRemoveWorkflows } from "./blockRemoveWorkflows.js";

//#region src/blocks/blockPnpmDedupe.ts
const blockPnpmDedupe = base.createBlock({
	about: { name: "pnpm Dedupe" },
	produce() {
		return { addons: [
			blockDevelopmentDocs({ sections: { Linting: { contents: { items: [`- \`pnpm lint:packages\` ([pnpm dedupe --check](https://pnpm.io/cli/dedupe)): Checks for unnecessarily duplicated packages in the \`pnpm-lock.yaml\` file`] } } } }),
			blockGitHubActionsCI({ jobs: [{
				name: "Lint Packages",
				steps: [{ run: "pnpm lint:packages" }]
			}] }),
			blockPackageJson({
				cleanupCommands: ["pnpm dedupe"],
				properties: { scripts: { "lint:packages": "pnpm dedupe --check" } }
			})
		] };
	},
	transition() {
		return { addons: [blockRemoveWorkflows({ workflows: ["lint-packages"] })] };
	}
});

//#endregion
export { blockPnpmDedupe };
//# sourceMappingURL=blockPnpmDedupe.js.map