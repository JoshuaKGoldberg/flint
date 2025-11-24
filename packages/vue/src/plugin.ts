import { ts as tsPlugin } from "@flint.fyi/ts";
import { createPlugin } from "@flint.fyi/core";

import asyncComputed from "./rules/asyncComputed.js";
import vForKey from "./rules/vForKey.js";

export const vue = createPlugin({
	files: {
		all: [tsPlugin.files!.all, "**/*.vue"],
	},
	name: "vue",
	rules: [asyncComputed, vForKey],
});
