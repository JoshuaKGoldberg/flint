import { ts } from "./packages/ts/lib/index.js";

const debuggerRule = ts.rulesById.get("debuggerStatements");
console.log("Found debuggerStatements:", !!debuggerRule);
if (debuggerRule) {
	console.log("Rule about:", debuggerRule.about);
	const mockContext = {
		report: (msg) => console.log("Report called:", msg),
		sourceFile: {},
	};
	const runtime = debuggerRule.setup(mockContext, {});
	console.log("Runtime:", runtime);
	console.log("Rule visitors:", Object.keys(runtime.visitors || {}));
}
