import { PartialPackageData } from "../types.js";

//#region src/options/readPnpm.d.ts
declare function readPnpm(packageData: () => Promise<PartialPackageData>): Promise<string>;
//#endregion
export { readPnpm };
//# sourceMappingURL=readPnpm.d.ts.map