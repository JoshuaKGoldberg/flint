import {
	isConfig,
	runConfigFixing,
	runConfigOnce,
	runPrettier,
} from "@flint.fyi/core";
import { debugForFile } from "debug-for-file";
import path from "node:path";

import { OptionsValues } from "./options.js";
import { Renderer } from "./renderers/types.js";

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

	const runConfigResults = await (values.fix
		? runConfigFixing(configDefinition, new Set(values["fix-suggestions"]))
		: runConfigOnce(configDefinition));

	// TODO: Eventually, it'd be nice to move everything fully in-memory.
	// This would be better for performance to avoid excess file system I/O.
	// https://github.com/JoshuaKGoldberg/flint/issues/73
	const formattingResults = await runPrettier(runConfigResults, values.fix);

	await renderer.render({ formattingResults, runConfigResults });

	if (formattingResults.dirty.size && !formattingResults.written) {
		return 1;
	}

	for (const fileResults of runConfigResults.filesResults.values()) {
		if (fileResults.diagnostics.length || fileResults.reports.length) {
			return 1;
		}
	}

	return 0;
}
