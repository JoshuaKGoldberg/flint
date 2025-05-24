import { isConfig } from "../configs/isConfig.js";
import { findConfigFileName } from "./findConfigFileName.js";

export async function runCli() {
	const configFileName = await findConfigFileName(process.cwd());
	if (!configFileName) {
		return {
			code: 2,
			message: "No flint.config.* file found",
		};
	}

	const { default: config } = (await import(configFileName)) as {
		default: unknown;
	};

	if (!isConfig(config)) {
		return {
			code: 2,
			message: `${configFileName} does not default export a Flint defineConfig value.`,
		};
	}

	console.log("I will lint with:");
	console.log(config.definition);

	return {
		code: 0,
	};
}
