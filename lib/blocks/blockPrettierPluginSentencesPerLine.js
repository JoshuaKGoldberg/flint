import { base } from "../base.js";
import { blockPrettier } from "./blockPrettier.js";

//#region src/blocks/blockPrettierPluginSentencesPerLine.ts
const blockPrettierPluginSentencesPerLine = base.createBlock({
	about: { name: "Prettier Plugin Sentences Per Line" },
	produce() {
		return { addons: [blockPrettier({ plugins: ["prettier-plugin-sentences-per-line"] })] };
	}
});

//#endregion
export { blockPrettierPluginSentencesPerLine };
//# sourceMappingURL=blockPrettierPluginSentencesPerLine.js.map