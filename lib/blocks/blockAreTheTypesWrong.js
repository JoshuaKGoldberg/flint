import { base } from "../base.js";
import { blockGitHubActionsCI } from "./blockGitHubActionsCI.js";

//#region src/blocks/blockAreTheTypesWrong.ts
const blockAreTheTypesWrong = base.createBlock({
	about: { name: "Are The Types Wrong" },
	produce() {
		return { addons: [blockGitHubActionsCI({ jobs: [{
			name: "Are The Types Wrong?",
			steps: [{ run: "pnpm build" }, { run: "npx --yes @arethetypeswrong/cli --pack . --ignore-rules cjs-resolves-to-esm" }]
		}] })] };
	}
});

//#endregion
export { blockAreTheTypesWrong };
//# sourceMappingURL=blockAreTheTypesWrong.js.map