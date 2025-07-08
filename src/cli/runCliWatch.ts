import debounce from "debounce";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { Presenter } from "../types/presenters.js";
import { OptionsValues } from "./options.js";
import { runCliOnce } from "./runCliOnce.js";

const log = debugForFile(import.meta.filename);

export async function runCliWatch(
	presenterFactory: Presenter,
	values: OptionsValues,
) {
	const cwd = process.cwd();
	const watcher = fs.watch(cwd, {
		recursive: true,
	});

	log("Running single-run CLI once before watching");
	console.clear();
	await runCliOnce(presenterFactory, "watch", values);

	const rerun = debounce(async (fileName: string) => {
		if (fileName.startsWith("node_modules/.cache")) {
			log("Skipping re-running watch mode for ignored change to: %s", fileName);
			return;
		}

		log("Change detected from: %s", fileName);
		console.clear();
		await runCliOnce(presenterFactory, "watch", values);
	}, 100);

	log("Watching cwd:", cwd);
	for await (const event of watcher) {
		if (event.filename) {
			await rerun(event.filename);
		}
	}
}
