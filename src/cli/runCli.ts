import { parseArgs } from "node:util";

import { getPresenterFactory } from "../presenters/getPresenterFactory.js";
import { options } from "./options.js";
import { packageData } from "./packageData.js";
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

	const [runner, runMode] = values.watch
		? ([runCliWatch, "watch"] as const)
		: ([runCliOnce, "single-run"] as const);

	const presenterFactory = getPresenterFactory(values.presenter);

	return await runner(presenterFactory, runMode, values);
}
