import { debugForFile } from "debug-for-file";

import { isConfig } from "../configs/isConfig.js";
import { runConfig } from "../running/lintConfig.js";
import { findConfigFileName } from "./findConfigFileName.js";

const log = debugForFile(import.meta.filename);

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

	log("Running with Flint config: %s", configFileName);
	await runConfig(config.definition);

	return {
		code: 0,
	};
}
