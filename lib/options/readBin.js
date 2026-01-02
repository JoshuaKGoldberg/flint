import { trimPrecedingSlash } from "../utils/trimPrecedingSlash.js";

//#region src/options/readBin.ts
async function readBin(getPackageData) {
	const { bin } = await getPackageData();
	return typeof bin === "object" ? Object.fromEntries(Object.entries(bin).map(([key, value]) => [key, trimPrecedingSlash(value)])) : trimPrecedingSlash(bin);
}

//#endregion
export { readBin };
//# sourceMappingURL=readBin.js.map