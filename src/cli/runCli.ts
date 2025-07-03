import { parseArgs } from "node:util";

import { plainPresenter } from "../presenters/plain.js";
import { options } from "./options.js";
import { packageData } from "./packageData.js";
import { runCliSingleRun } from "./runCliSingleRun.js";
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

	return await (values.watch
		? runCliWatch(values)
		: runCliSingleRun(values, plainPresenter));
}
