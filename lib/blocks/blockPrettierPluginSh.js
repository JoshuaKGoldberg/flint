import { base } from "../base.js";
import { blockPrettier } from "./blockPrettier.js";

//#region src/blocks/blockPrettierPluginSh.ts
const blockPrettierPluginSh = base.createBlock({
	about: { name: "Prettier Plugin Sh" },
	produce() {
		return { addons: [blockPrettier({ plugins: ["prettier-plugin-sh"] })] };
	}
});

//#endregion
export { blockPrettierPluginSh };
//# sourceMappingURL=blockPrettierPluginSh.js.map