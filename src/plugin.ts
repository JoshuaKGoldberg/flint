import { createPlugin } from "./plugins/createPlugin.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import forInArrays from "./rules/forInArrays.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";

export const ts = createPlugin({
	name: "ts",
	rules: [forInArrays, consecutiveNonNullAssertions, namespaceDeclarations],
});
