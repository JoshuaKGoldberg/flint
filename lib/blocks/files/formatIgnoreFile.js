//#region src/blocks/files/formatIgnoreFile.ts
function formatIgnoreFile(lines) {
	return [...lines.filter(Boolean), ""].join("\n");
}

//#endregion
export { formatIgnoreFile };
//# sourceMappingURL=formatIgnoreFile.js.map