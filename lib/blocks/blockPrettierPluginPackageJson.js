import { base } from "../base.js";
import { blockPrettier } from "./blockPrettier.js";

//#region src/blocks/blockPrettierPluginPackageJson.ts
const blockPrettierPluginPackageJson = base.createBlock({
	about: { name: "Prettier Plugin Package JSON" },
	produce() {
		return { addons: [blockPrettier({ plugins: ["prettier-plugin-packagejson"] })] };
	}
});

//#endregion
export { blockPrettierPluginPackageJson };
//# sourceMappingURL=blockPrettierPluginPackageJson.js.map