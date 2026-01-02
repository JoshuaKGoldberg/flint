import * as npm_user0 from "npm-user";
import { ExecaError, Result } from "execa";

//#region src/options/readNpmDefaults.d.ts
declare function readNpmDefaults(getNpmWhoami: () => Promise<ExecaError | Result | undefined>): Promise<npm_user0.UserInfo | undefined>;
//#endregion
export { readNpmDefaults };
//# sourceMappingURL=readNpmDefaults.d.ts.map