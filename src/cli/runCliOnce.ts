import { debugForFile } from "debug-for-file";
import path from "node:path";

import { writeToCache } from "../cache/writeToCache.js";
import { isConfig } from "../configs/isConfig.js";
import { runPrettier } from "../formatting/runPrettier.js";
import { runConfig } from "../running/runConfig.js";
import { runConfigFixing } from "../running/runConfigFixing.js";
import { Renderer } from "../types/renderers.js";
import { OptionsValues } from "./options.js";

const log = debugForFile(import.meta.filename);

export async function runCliOnce(
	configFileName: string,
	renderer: Renderer,
	values: OptionsValues,
) {
	const { default: config } = (await import(
		path.join(process.cwd(), configFileName)
	)) as {
		default: unknown;
	};

	if (!isConfig(config)) {
		console.error(
			`${configFileName} does not default export a Flint defineConfig value.`,
		);
		return 2;
	}

	log("Running with Flint in single-run mode with config: %s", configFileName);
	renderer.announce();

	const configDefinition = {
		...config.definition,
		filePath: configFileName,
	};

	const configResults = await (values.fix
		? runConfigFixing(configDefinition)
		: runConfig(configDefinition));

	// TODO: Eventually, it'd be nice to move everything fully in-memory.
	// This would be better for performance to avoid excess file system I/O.
	// https://github.com/JoshuaKGoldberg/flint/issues/73
	const [formattingResults] = await Promise.all([
		runPrettier(configResults.allFilePaths, values.fix),
		writeToCache(configFileName, configResults),
	]);

	await renderer.render({ configResults, formattingResults });

	if (formattingResults.dirty.size && !formattingResults.written) {
		return 1;
	}

	if (configResults.languageDiagnostics.length) {
		return 1;
	}

	for (const fileResults of configResults.filesResults.values()) {
		if (fileResults.reports.length) {
			return 1;
		}
	}

	return 0;
}
