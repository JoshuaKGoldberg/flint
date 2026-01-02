import { swallowError } from "../utils/swallowError.js";
import { defaults } from "../constants.js";

//#region src/options/readNode.ts
async function readNode(getNvmrc, getPackageDataFull) {
	const { engines } = await getPackageDataFull();
	return {
		minimum: (engines?.node && /[\d+.]+/.exec(engines.node))?.[0] ?? defaults.node.minimum,
		pinned: swallowError(await getNvmrc())?.trim() || defaults.node.pinned
	};
}

//#endregion
export { readNode };
//# sourceMappingURL=readNode.js.map