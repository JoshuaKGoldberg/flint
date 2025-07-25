import { parseArgs, ParseArgsOptionsConfig } from "node:util";

export const options = {
	fix: {
		type: "boolean",
	},
	help: {
		type: "boolean",
	},
	interactive: {
		type: "boolean",
	},
	presenter: {
		type: "string",
	},
	suggestions: {
		multiple: true,
		type: "string",
	},
	version: {
		type: "boolean",
	},
	watch: {
		type: "boolean",
	},
} satisfies ParseArgsOptionsConfig;

export type OptionsValues = ReturnType<
	typeof parseArgs<{ options: typeof options }>
>["values"];
