import { cacheFilePath } from "@flint.fyi/core";
import chalk from "chalk";
import fs from "node:fs";

import { PresenterInitializeContext } from "../types.js";

export function* presentHeader({
	configFileName,
	ignoreCache,
	runMode,
}: PresenterInitializeContext) {
	yield chalk.gray(
		runMode === "single-run"
			? `Linting with ${configFileName}...`
			: `Running with ${configFileName} in --watch mode (start time: ${Date.now()})...`,
	);

	if (!ignoreCache) {
		return;
	}

	const cacheExists = fs.existsSync(cacheFilePath);

	yield chalk.gray(
		cacheExists
			? `--cache-ignore: ignoring cache file at ${cacheFilePath}`
			: `--cache-ignore specified but no cache exists at ${cacheFilePath}`,
	);
}
