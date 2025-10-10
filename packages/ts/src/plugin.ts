import { createPlugin } from "@flint.fyi/core";

import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.js";
import chainedAssignments from "./rules/chainedAssignments.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import constructorReturns from "./rules/constructorReturns.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import defaultCaseLast from "./rules/defaultCaseLast.js";
import exceptionAssignments from "./rules/exceptionAssignments.js";
import forInArrays from "./rules/forInArrays.js";
import functionAssignments from "./rules/functionAssignments.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import newExpressions from "./rules/newExpressions.js";
import objectProto from "./rules/objectProto.js";
import octalEscapes from "./rules/octalEscapes.js";
import octalNumbers from "./rules/octalNumbers.js";
import unnecessaryCatches from "./rules/unnecessaryCatches.js";
import variableDeletions from "./rules/variableDeletions.js";
import voidOperator from "./rules/voidOperator.js";

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
		exceptionAssignments,
		forInArrays,
		functionAssignments,
		namespaceDeclarations,
		newExpressions,
		objectProto,
		octalEscapes,
		octalNumbers,
		unnecessaryCatches,
		variableDeletions,
		voidOperator,
	],
});
