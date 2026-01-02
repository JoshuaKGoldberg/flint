import { swallowError } from "../utils/swallowError.js";
import { inputFromFileJSON } from "input-from-file-json";

//#region src/options/readPackageData.ts
async function readPackageData(take) {
	return swallowError(await take(inputFromFileJSON, { filePath: "./package.json" })) || {};
}

//#endregion
export { readPackageData };
//# sourceMappingURL=readPackageData.js.map