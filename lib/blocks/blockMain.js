import { base } from "../base.js";
import { blockPackageJson } from "./blockPackageJson.js";
import { blockTSDown } from "./blockTSDown.js";
import { z } from "zod";

//#region src/blocks/blockMain.ts
const blockMain = base.createBlock({
	about: { name: "Main" },
	addons: {
		filePath: z.string().optional(),
		runArgs: z.array(z.string()).default([])
	},
	produce({ addons }) {
		const { filePath = "lib/index.js", runArgs } = addons;
		return { addons: [blockPackageJson({ properties: { main: filePath } }), blockTSDown({ runInCI: [`node ${filePath}${runArgs.map((arg) => ` ${arg}`).join("")}`] })] };
	}
});

//#endregion
export { blockMain };
//# sourceMappingURL=blockMain.js.map