//#region src/blocks/files/createJobName.ts
function createJobName(label) {
	return label.replaceAll(/[?()]/g, "").replaceAll(" ", "_").toLowerCase();
}

//#endregion
export { createJobName };
//# sourceMappingURL=createJobName.js.map