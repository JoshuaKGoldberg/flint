//#region src/options/readAccess.ts
async function readAccess(getPackageDataFull) {
	return (await getPackageDataFull())?.publishConfig?.access ?? "public";
}

//#endregion
export { readAccess };
//# sourceMappingURL=readAccess.js.map