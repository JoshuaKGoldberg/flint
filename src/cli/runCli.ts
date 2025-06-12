import { debugForFile } from "debug-for-file";
import { parseArgs } from "node:util";

import { isConfig } from "../configs/isConfig.js";
import { plainReporter } from "../reporters/plain.js";
import { runConfig } from "../running/lintConfig.js";
import { findConfigFileName } from "./findConfigFileName.js";
import { packageData } from "./packageData.js";

const log = debugForFile(import.meta.filename);

export async function runCli() {
	const { values } = parseArgs({
		options: {
			help: {
				type: "boolean",
			},
			version: {
				type: "boolean",
			},
		},
		strict: true,
	});

	if (values.help) {
		console.log("Welcome to Flint!");
		console.log("Flint is still very early stage and experimental.");
		console.log(
			"See \u001b]8;;http://github.com/JoshuaKGoldberg/flint\u0007github.com/JoshuaKGoldberg/flint\u001b]8;;\u0007 for more information.",
		);
		return 0;
	}

	if (values.version) {
		console.log(packageData.version);
		return 0;
	}

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
