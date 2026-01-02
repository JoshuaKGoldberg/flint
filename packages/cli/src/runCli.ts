import { parseArgs } from "node:util";

import packageData from "../package.json" with { type: "json" };
import { findConfigFileName } from "./findConfigFileName.js";
import { options } from "./options.js";
import { createRendererFactory } from "./renderers/createRendererFactory.js";
import { runCliOnce } from "./runCliOnce.js";
import { runCliWatch } from "./runCliWatch.js";

export async function runCli(args: string[]) {
	const { values } = parseArgs({
		args,
		options,
		strict: true,
	});

	if (values.help) {
		console.log("Welcome to Flint!");
		console.log("Flint is still very early stage and experimental.");
		console.log(
			"See \u001b]8;;flint.fyi\u0007flint.fyi\u001b]8;;\u0007 for more information.",
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

	const getRenderer = createRendererFactory(configFileName, values);

	if (values.watch) {
		await runCliWatch(configFileName, getRenderer, values);
		console.log("👋 Thanks for using Flint!");
		return 0;
	}

	const renderer = getRenderer();
	const exitCode = await runCliOnce(configFileName, renderer, values);

	renderer.dispose?.();

	return exitCode;
}
