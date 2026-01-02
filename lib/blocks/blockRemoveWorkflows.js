import { base } from "../base.js";
import { blockRemoveFiles } from "./blockRemoveFiles.js";
import { z } from "zod";

//#region src/blocks/blockRemoveWorkflows.ts
const blockRemoveWorkflows = base.createBlock({
	about: { name: "Remove Workflows" },
	addons: { workflows: z.array(z.string()).optional() },
	produce() {
		return {};
	},
	transition({ addons }) {
		const { workflows } = addons;
		return { addons: [blockRemoveFiles({ files: workflows?.map((workflow) => `.github/workflows/${workflow}.yaml`) })] };
	}
});

//#endregion
export { blockRemoveWorkflows };
//# sourceMappingURL=blockRemoveWorkflows.js.map