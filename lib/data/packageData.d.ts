import { package_d_exports } from "../package.js";

//#region src/data/packageData.d.ts
declare const packageData: typeof package_d_exports;
declare function getPackageDependencies(...names: string[]): {
  [k: string]: string;
};
declare function getPackageDependency(name: string): string;
//#endregion
export { getPackageDependencies, getPackageDependency, packageData };
//# sourceMappingURL=packageData.d.ts.map