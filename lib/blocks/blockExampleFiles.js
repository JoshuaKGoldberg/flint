import { base } from "../base.js";
import { blockREADME } from "./blockREADME.js";
import { z } from "zod";

//#region src/blocks/blockExampleFiles.ts
const blockExampleFiles = base.createBlock({
	about: { name: "Example Files" },
	addons: {
		files: z.record(z.string()).default({}),
		usage: z.array(z.string()).default([])
	},
	setup({ addons }) {
		const { usage } = addons;
		return {
			addons: [blockREADME({ defaultUsage: usage })],
			files: { src: addons.files }
		};
	},
	produce() {
		return {};
	}
});

//#endregion
export { blockExampleFiles };
//# sourceMappingURL=blockExampleFiles.js.map