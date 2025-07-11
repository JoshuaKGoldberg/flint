import chalk from "chalk";

import { PresenterInitializeContext } from "../types.js";

export function presentHeader({
	configFileName,
	runMode,
}: PresenterInitializeContext) {
	return chalk.gray(
		runMode === "single-run"
			? `Linting with ${configFileName}...`
			: `Running with ${configFileName} in --watch mode (start time: ${Date.now()})...`,
	);
}
