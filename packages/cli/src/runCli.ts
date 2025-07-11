import { parseArgs } from "node:util";

import { findConfigFileName } from "./findConfigFileName.js";
import { options } from "./options.js";
import { packageData } from "./packageData.js";
import { getPresenterFactory } from "./presenters/getPresenterFactory.js";
import { interactiveRendererFactory } from "./renderers/interactive/interactiveRendererFactory.js";
import { singleRendererFactory } from "./renderers/singleRendererFactory.js";
import { runCliOnce } from "./runCliOnce.js";
import { runCliWatch } from "./runCliWatch.js";

export async function runCli() {
	const { values } = parseArgs({
		options,
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

	const presenterFactory = getPresenterFactory(values);
	const rendererFactory = values.interactive
		? interactiveRendererFactory
		: singleRendererFactory;

	const getRenderer = () =>
		rendererFactory.initialize(
			presenterFactory.initialize({
				configFileName,
				runMode: values.watch ? "watch" : "single-run",
			}),
		);

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
