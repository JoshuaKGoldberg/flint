import { base } from "./base.js";
import { blockRemoveFiles } from "./blocks/blockRemoveFiles.js";
import { blockAreTheTypesWrong } from "./blocks/blockAreTheTypesWrong.js";
import { blockCTATransitions } from "./blocks/blockCTATransitions.js";
import { blockRemoveDependencies } from "./blocks/blockRemoveDependencies.js";
import { blockESLintPlugin } from "./blocks/blockESLintPlugin.js";
import { blockNcc } from "./blocks/blockNcc.js";
import { blockWebExt } from "./blocks/blockWebExt.js";
import { presetMinimal } from "./presets/minimal.js";
import { presetCommon } from "./presets/common.js";
import { presetEverything } from "./presets/everything.js";

//#region src/template.ts
const template = base.createStratumTemplate({
	about: {
		name: "Create TypeScript App",
		repository: {
			owner: "JoshuaKGoldberg",
			repository: "create-typescript-app"
		}
	},
	blocks: [
		blockAreTheTypesWrong,
		blockCTATransitions,
		blockESLintPlugin,
		blockNcc,
		blockRemoveDependencies,
		blockRemoveFiles,
		blockWebExt
	],
	presets: [
		presetMinimal,
		presetCommon,
		presetEverything
	],
	suggested: presetCommon
});

//#endregion
export { template };
//# sourceMappingURL=template.js.map