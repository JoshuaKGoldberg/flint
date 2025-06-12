import { debugForFile } from "debug-for-file";

import { isConfig } from "../configs/isConfig.js";
import { plainReporter } from "../reporters/plain.js";
import { runConfig } from "../running/lintConfig.js";
import { findConfigFileName } from "./findConfigFileName.js";

const log = debugForFile(import.meta.filename);

export async function runCli() {
	const configFileName = await findConfigFileName(process.cwd());
	if (!configFileName) {
		console.error("No flint.config.* file found");
		return 2;
	}

	const { default: config } = (await import(configFileName)) as {
		default: unknown;
	};

	if (!isConfig(config)) {
		console.error(
			`${configFileName} does not default export a Flint defineConfig value.`,
		);
		return 2;
	}

	log("Running with Flint config: %s", configFileName);
	const allRuleReports = await runConfig(config.definition);

	for (const line of plainReporter(allRuleReports)) {
		console.log(line);
	}

	return allRuleReports.size ? 1 : 0;
}
