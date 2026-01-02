import { formatYaml } from "./formatYaml.js";

//#region src/blocks/files/formatWorkflowYaml.ts
function formatWorkflowYaml(value) {
	return formatYaml(value).replaceAll(/\n(\S)/g, "\n\n$1").replaceAll(/: "\\n(.+)"/g, ": |\n$1").replaceAll("\\n", "\n").replaceAll("\\t", "  ");
}

//#endregion
export { formatWorkflowYaml };
//# sourceMappingURL=formatWorkflowYaml.js.map