import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts],
});
