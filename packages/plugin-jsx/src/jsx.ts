import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import headingContents from "./rules/headingContents.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, headingContents, htmlLangs, iframeTitles],
});
