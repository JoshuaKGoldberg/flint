import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import distractingElements from "./rules/distractingElements.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, distractingElements],
});
