import { createPlugin } from "@flint.fyi/core";

import assertStrict from "./rules/assertStrict.js";
import eventClasses from "./rules/eventClasses.js";

export const node = createPlugin({
	name: "node",
	rules: [assertStrict, eventClasses],
});
