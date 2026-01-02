import { removeUsesQuotes } from "./removeUsesQuotes.js";
import jsYaml from "js-yaml";

//#region src/blocks/files/formatYaml.ts
const options = {
	lineWidth: -1,
	noCompatMode: true,
	replacer(_, value) {
		if (typeof value !== "string" || !value.includes("\n		")) return value;
		return value.replaceAll(": |-\n", ": |\n").replaceAll("\n	  			", "").replaceAll(/\n\t\t\t\t\t\t$/g, "");
	},
	sortKeys: true,
	styles: { "!!null": "canonical" }
};
function formatYaml(value) {
	return removeUsesQuotes(jsYaml.dump(value, options)).replaceAll(/\n(\S)/g, "\n\n$1");
}

//#endregion
export { formatYaml };
//# sourceMappingURL=formatYaml.js.map