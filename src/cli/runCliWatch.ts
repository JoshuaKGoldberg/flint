import debounce from "debounce";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { createWatchPresenter, watchPresenter } from "../presenters/watch.js";
import { OptionsValues } from "./options.js";
import { runCliSingleRun } from "./runCliSingleRun.js";

const log = debugForFile(import.meta.filename);

export async function runCliWatch(values: OptionsValues) {
	const cwd = process.cwd();
	const watcher = fs.watch(cwd, {
		recursive: true,
	});

	const watchPresenter = createWatchPresenter();

	log("Running single-run CLI once before watching");
	await runCliSingleRun(values, watchPresenter);

	const rerun = debounce(async (fileName: string) => {
		if (fileName.startsWith("node_modules/.cache")) {
			log("Skipping re-running watch mode for ignored change to: %s", fileName);
			return;
		}

		log("Change detected from: %s", fileName);
		await runCliSingleRun(values, watchPresenter);
	}, 100);

	log("Watching cwd:", cwd);
	for await (const event of watcher) {
		if (event.filename) {
			await rerun(event.filename);
		}
	}
}
