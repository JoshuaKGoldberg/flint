import { createPlugin } from "@flint.fyi/core";

import eventClasses from "./rules/eventClasses.js";

export const node = createPlugin({
	name: "node",
	rules: [eventClasses],
});
