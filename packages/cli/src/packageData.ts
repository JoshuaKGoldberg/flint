import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const packageData =
	// Importing from above src/ would expand the TS build rootDir
	require("../package.json") as typeof import("../package.json");
