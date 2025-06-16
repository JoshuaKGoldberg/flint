import { debugForFile } from "debug-for-file";
import { parseArgs } from "node:util";

import { isConfig } from "../configs/isConfig.js";
import { runPrettier } from "../formatting/runPrettier.js";
import { plainReporter } from "../reporters/plain.js";
import { runConfig } from "../running/runConfig.js";
import { runConfigFixing } from "../running/runConfigFixing.js";
import { findConfigFileName } from "./findConfigFileName.js";
import { packageData } from "./packageData.js";

const log = debugForFile(import.meta.filename);

export async function runCli() {
	const { values } = parseArgs({
		options: {
			fix: {
				type: "boolean",
			},
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

	const configResults = await (values.fix
		? runConfigFixing(config.definition)
		: runConfig(config.definition));

	// TODO: Eventually, it'd be nice to move everything fully in-memory.
	// This would be better for performance to avoid excess file system I/O.
	// https://github.com/JoshuaKGoldberg/flint/issues/73
	const formattedCount = await runPrettier(configResults.allFilePaths);

	for (const line of plainReporter(configResults, formattedCount)) {
		console.log(line);
	}

	return configResults.filesResults.size ? 1 : 0;
}
