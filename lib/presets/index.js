import { presetMinimal } from "./minimal.js";
import { presetCommon } from "./common.js";
import { presetEverything } from "./everything.js";

//#region src/presets/index.ts
const presets = {
	common: presetCommon,
	everything: presetEverything,
	minimal: presetMinimal
};

//#endregion
export { presetCommon, presetEverything, presetMinimal, presets };
//# sourceMappingURL=index.js.map