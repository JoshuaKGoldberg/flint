import { createPlugin } from "@flint.fyi/core";

import anyReturns from "./rules/anyReturns.js";
import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.js";
import caseDeclarations from "./rules/caseDeclarations.js";
import caseDuplicates from "./rules/caseDuplicates.js";
import chainedAssignments from "./rules/chainedAssignments.js";
import classAssignments from "./rules/classAssignments.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import constantAssignments from "./rules/constantAssignments.js";
import constructorReturns from "./rules/constructorReturns.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import defaultCaseLast from "./rules/defaultCaseLast.js";
import duplicateArguments from "./rules/duplicateArguments.js";
import elseIfDuplicates from "./rules/elseIfDuplicates.js";
import emptyDestructures from "./rules/emptyDestructures.js";
import emptyStaticBlocks from "./rules/emptyStaticBlocks.js";
import exceptionAssignments from "./rules/exceptionAssignments.js";
import forDirections from "./rules/forDirections.js";
import forInArrays from "./rules/forInArrays.js";
import functionAssignments from "./rules/functionAssignments.js";
import functionNewCalls from "./rules/functionNewCalls.js";
import generatorFunctionYields from "./rules/generatorFunctionYields.js";
import globalAssignments from "./rules/globalAssignments.js";
import globalObjectCalls from "./rules/globalObjectCalls.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import negativeZeroComparisons from "./rules/negativeZeroComparisons.js";
import newExpressions from "./rules/newExpressions.js";
import newNativeNonConstructors from "./rules/newNativeNonConstructors.js";
import nonOctalDecimalEscapes from "./rules/nonOctalDecimalEscapes.js";
import numericLiteralParsing from "./rules/numericLiteralParsing.js";
import objectProto from "./rules/objectProto.js";
import octalEscapes from "./rules/octalEscapes.js";
import octalNumbers from "./rules/octalNumbers.js";
import returnAssignments from "./rules/returnAssignments.js";
import selfAssignments from "./rules/selfAssignments.js";
import selfComparisons from "./rules/selfComparisons.js";
import sequences from "./rules/sequences.js";
import shadowedRestrictedNames from "./rules/shadowedRestrictedNames.js";
import sparseArrays from "./rules/sparseArrays.js";
import symbolDescriptions from "./rules/symbolDescriptions.js";
import typeofComparisons from "./rules/typeofComparisons.js";
import unassignedVariables from "./rules/unassignedVariables.js";
import undefinedVariables from "./rules/undefinedVariables.js";
import unicodeBOMs from "./rules/unicodeBOMs.js";
import unnecessaryCatches from "./rules/unnecessaryCatches.js";
import unsafeNegations from "./rules/unsafeNegations.js";
import variableDeletions from "./rules/variableDeletions.js";
import voidOperator from "./rules/voidOperator.js";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules: [
		anyReturns,
		asyncPromiseExecutors,
		caseDeclarations,
		caseDuplicates,
		chainedAssignments,
		classAssignments,
		consecutiveNonNullAssertions,
		constantAssignments,
		constructorReturns,
		debuggerStatements,
		defaultCaseLast,
		duplicateArguments,
		elseIfDuplicates,
		emptyDestructures,
		emptyStaticBlocks,
		exceptionAssignments,
		forDirections,
		forInArrays,
		functionAssignments,
		functionNewCalls,
		generatorFunctionYields,
		globalAssignments,
		globalObjectCalls,
		namespaceDeclarations,
		negativeZeroComparisons,
		newExpressions,
		newNativeNonConstructors,
		nonOctalDecimalEscapes,
		numericLiteralParsing,
		objectProto,
		octalEscapes,
		octalNumbers,
		returnAssignments,
		selfAssignments,
		selfComparisons,
		sequences,
		shadowedRestrictedNames,
		sparseArrays,
		symbolDescriptions,
		typeofComparisons,
		unassignedVariables,
		undefinedVariables,
		unicodeBOMs,
		unnecessaryCatches,
		unsafeNegations,
		variableDeletions,
		voidOperator,
	],
});
