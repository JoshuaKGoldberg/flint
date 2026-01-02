import { base } from "../base.js";
import { blockOctoGuide } from "./blockOctoGuide.js";

//#region src/blocks/blockOctoGuideStrict.ts
const blockOctoGuideStrict = base.createBlock({
	about: { name: "OctoGuide Strict" },
	produce() {
		return { addons: [blockOctoGuide({ config: "strict" })] };
	}
});

//#endregion
export { blockOctoGuideStrict };
//# sourceMappingURL=blockOctoGuideStrict.js.map