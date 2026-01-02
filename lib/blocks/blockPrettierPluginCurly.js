import { base } from "../base.js";
import { blockPrettier } from "./blockPrettier.js";

//#region src/blocks/blockPrettierPluginCurly.ts
const blockPrettierPluginCurly = base.createBlock({
	about: { name: "Prettier Plugin Curly" },
	produce() {
		return { addons: [blockPrettier({ plugins: ["prettier-plugin-curly"] })] };
	}
});

//#endregion
export { blockPrettierPluginCurly };
//# sourceMappingURL=blockPrettierPluginCurly.js.map