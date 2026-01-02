import { PartialPackageData } from "../types.js";

//#region src/options/readKeywords.d.ts
declare function readKeywords(getPackageData: () => Promise<PartialPackageData>): Promise<string[] | undefined>;
//#endregion
export { readKeywords };
//# sourceMappingURL=readKeywords.d.ts.map