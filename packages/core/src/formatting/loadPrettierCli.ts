import { createRequire } from "node:module";

/**
 * @see https://github.com/prettier/prettier/issues/17422
 * @see https://github.com/prettier/prettier/blob/e7202d63e715728bc891eab0075eddc6194980db/src/cli/index.js#L13
 */
interface PrettierInternalCLI {
	run(rawArguments?: string[]): Promise<unknown>;
}

const require = createRequire(import.meta.url);

export function loadPrettierCli() {
	// We do a Bad Thing and load Prettier's CLI module directly.
	// It's not in prettier's exports, but CJS require() doesn't respect those.
	// See https://github.com/prettier/prettier/issues/17422
	return require("prettier/internal/cli.mjs") as PrettierInternalCLI;
}
