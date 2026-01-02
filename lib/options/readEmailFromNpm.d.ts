import { PackageAuthor } from "./readPackageAuthor.js";
import { UserInfo } from "npm-user";

//#region src/options/readEmailFromNpm.d.ts
declare function readEmailFromNpm(getNpmDefaults: () => Promise<undefined | UserInfo>, getPackageAuthor: () => Promise<PackageAuthor>): Promise<string | undefined>;
//#endregion
export { readEmailFromNpm };
//# sourceMappingURL=readEmailFromNpm.d.ts.map