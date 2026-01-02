import { intakeFile } from "./intakeFile.js";
import jsYaml from "js-yaml";

//#region src/blocks/intake/intakeFileAsYaml.ts
function intakeFileAsYaml(files, filePath) {
	const file = intakeFile(files, filePath) ?? intakeFile(files, [...filePath.slice(0, filePath.length - 1), filePath[filePath.length - 1].replace(/\.yaml$/i, ".yml")]);
	try {
		return file && jsYaml.load(file[0]);
	} catch {
		return;
	}
}

//#endregion
export { intakeFileAsYaml };
//# sourceMappingURL=intakeFileAsYaml.js.map