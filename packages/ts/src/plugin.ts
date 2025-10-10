import { createPlugin } from "@flint.fyi/core";

import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.js";
import chainedAssignments from "./rules/chainedAssignments.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import constructorReturns from "./rules/constructorReturns.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import defaultCaseLast from "./rules/defaultCaseLast.js";
import forInArrays from "./rules/forInArrays.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import objectProto from "./rules/objectProto.js";
import octalEscapes from "./rules/octalEscapes.js";
import octalNumbers from "./rules/octalNumbers.js";
import variableDeletions from "./rules/variableDeletions.js";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules: [
		asyncPromiseExecutors,
		chainedAssignments,
		consecutiveNonNullAssertions,
		constructorReturns,
		debuggerStatements,
		defaultCaseLast,
		forInArrays,
		namespaceDeclarations,
		objectProto,
		octalEscapes,
		octalNumbers,
		variableDeletions,
	],
});
