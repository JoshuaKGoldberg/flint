import { PartialPackageData } from "../types.js";

//#region src/options/readAccess.d.ts
declare function readAccess(getPackageDataFull: () => Promise<PartialPackageData | undefined>): Promise<"public" | "restricted">;
//#endregion
export { readAccess };
//# sourceMappingURL=readAccess.d.ts.map