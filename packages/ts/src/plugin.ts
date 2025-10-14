import { createPlugin } from "@flint.fyi/core";

import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.js";
import caseDeclarations from "./rules/caseDeclarations.js";
import chainedAssignments from "./rules/chainedAssignments.js";
import classAssignments from "./rules/classAssignments.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import constantAssignments from "./rules/constantAssignments.js";
import constructorReturns from "./rules/constructorReturns.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import defaultCaseLast from "./rules/defaultCaseLast.js";
import emptyDestructures from "./rules/emptyDestructures.js";
import emptyStaticBlocks from "./rules/emptyStaticBlocks.js";
import exceptionAssignments from "./rules/exceptionAssignments.js";
import forInArrays from "./rules/forInArrays.js";
import functionAssignments from "./rules/functionAssignments.js";
import generatorFunctionYields from "./rules/generatorFunctionYields.js";
import guardedForIns from "./rules/guardedForIns.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import negativeZeroComparisons from "./rules/negativeZeroComparisons.js";
import newExpressions from "./rules/newExpressions.js";
import newNativeNonConstructors from "./rules/newNativeNonConstructors.js";
import objectProto from "./rules/objectProto.js";
import octalEscapes from "./rules/octalEscapes.js";
import octalNumbers from "./rules/octalNumbers.js";
import sparseArrays from "./rules/sparseArrays.js";
import symbolDescriptions from "./rules/symbolDescriptions.js";
import undefinedVariables from "./rules/undefinedVariables.js";
import unicodeBOMs from "./rules/unicodeBOMs.js";
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
		caseDeclarations,
		chainedAssignments,
		classAssignments,
		consecutiveNonNullAssertions,
		constantAssignments,
		constructorReturns,
		debuggerStatements,
		defaultCaseLast,
		emptyDestructures,
		emptyStaticBlocks,
		exceptionAssignments,
		forInArrays,
		functionAssignments,
		generatorFunctionYields,
		guardedForIns,
		namespaceDeclarations,
		negativeZeroComparisons,
		newExpressions,
		newNativeNonConstructors,
		objectProto,
		octalEscapes,
		octalNumbers,
		sparseArrays,
		symbolDescriptions,
		undefinedVariables,
		unicodeBOMs,
		unnecessaryCatches,
		variableDeletions,
		voidOperator,
	],
});
