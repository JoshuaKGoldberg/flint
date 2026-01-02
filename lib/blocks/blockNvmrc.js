import { base } from "../base.js";
import { blockPrettier } from "./blockPrettier.js";

//#region src/blocks/blockNvmrc.ts
const blockNvmrc = base.createBlock({
	about: { name: "Nvmrc" },
	produce({ options }) {
		return {
			addons: [blockPrettier({ overrides: [{
				files: ".nvmrc",
				options: { parser: "yaml" }
			}] })],
			...options.node.pinned && { files: { ".nvmrc": `${options.node.pinned}\n` } }
		};
	}
});

//#endregion
export { blockNvmrc };
//# sourceMappingURL=blockNvmrc.js.map