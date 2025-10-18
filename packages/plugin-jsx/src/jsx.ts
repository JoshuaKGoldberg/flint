import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import mediaCaptions from "./rules/mediaCaptions.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, htmlLangs, iframeTitles, mediaCaptions],
});
