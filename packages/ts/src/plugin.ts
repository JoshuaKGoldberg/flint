import { createPlugin } from "@flint.fyi/core";

import anyReturns from "./rules/anyReturns.ts";
import arrayFilteredFinds from "./rules/arrayFilteredFinds.ts";
import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.ts";
import caseDeclarations from "./rules/caseDeclarations.ts";
import caseDuplicates from "./rules/caseDuplicates.ts";
import chainedAssignments from "./rules/chainedAssignments.ts";
import classAssignments from "./rules/classAssignments.ts";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.ts";
import constantAssignments from "./rules/constantAssignments.ts";
import constructorReturns from "./rules/constructorReturns.ts";
import debuggerStatements from "./rules/debuggerStatements.ts";
import defaultCaseLast from "./rules/defaultCaseLast.ts";
import duplicateArguments from "./rules/duplicateArguments.ts";
import elseIfDuplicates from "./rules/elseIfDuplicates.ts";
import emptyBlocks from "./rules/emptyBlocks.ts";
import emptyDestructures from "./rules/emptyDestructures.ts";
import emptyStaticBlocks from "./rules/emptyStaticBlocks.ts";
import exceptionAssignments from "./rules/exceptionAssignments.ts";
import finallyStatementSafety from "./rules/finallyStatementSafety.ts";
import forDirections from "./rules/forDirections.ts";
import forInArrays from "./rules/forInArrays.ts";
import functionAssignments from "./rules/functionAssignments.ts";
import functionCurryingRedundancy from "./rules/functionCurryingRedundancy.ts";
import functionNewCalls from "./rules/functionNewCalls.ts";
import generatorFunctionYields from "./rules/generatorFunctionYields.ts";
import globalAssignments from "./rules/globalAssignments.ts";
import globalObjectCalls from "./rules/globalObjectCalls.ts";
import namespaceDeclarations from "./rules/namespaceDeclarations.ts";
import negativeZeroComparisons from "./rules/negativeZeroComparisons.ts";
import newExpressions from "./rules/newExpressions.ts";
import newNativeNonConstructors from "./rules/newNativeNonConstructors.ts";
import nonOctalDecimalEscapes from "./rules/nonOctalDecimalEscapes.ts";
import numericLiteralParsing from "./rules/numericLiteralParsing.ts";
import objectCalls from "./rules/objectCalls.ts";
import objectHasOwns from "./rules/objectHasOwns.ts";
import objectKeyDuplicates from "./rules/objectKeyDuplicates.ts";
import objectProto from "./rules/objectProto.ts";
import objectPrototypeBuiltIns from "./rules/objectPrototypeBuiltIns.ts";
import octalEscapes from "./rules/octalEscapes.ts";
import octalNumbers from "./rules/octalNumbers.ts";
import returnAssignments from "./rules/returnAssignments.ts";
import selfAssignments from "./rules/selfAssignments.ts";
import selfComparisons from "./rules/selfComparisons.ts";
import sequences from "./rules/sequences.ts";
import shadowedRestrictedNames from "./rules/shadowedRestrictedNames.ts";
import sparseArrays from "./rules/sparseArrays.ts";
import symbolDescriptions from "./rules/symbolDescriptions.ts";
import typeofComparisons from "./rules/typeofComparisons.ts";
import unassignedVariables from "./rules/unassignedVariables.ts";
import undefinedVariables from "./rules/undefinedVariables.ts";
import unicodeBOMs from "./rules/unicodeBOMs.ts";
import unnecessaryBlocks from "./rules/unnecessaryBlocks.ts";
import unnecessaryCatches from "./rules/unnecessaryCatches.ts";
import unnecessaryConcatenation from "./rules/unnecessaryConcatenation.ts";
import unsafeNegations from "./rules/unsafeNegations.ts";
import variableDeletions from "./rules/variableDeletions.ts";
import voidOperator from "./rules/voidOperator.ts";
import withStatements from "./rules/withStatements.ts";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "TypeScript",
	rules: [
		anyReturns,
		arrayFilteredFinds,
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
		emptyBlocks,
		emptyDestructures,
		emptyStaticBlocks,
		exceptionAssignments,
		finallyStatementSafety,
		forDirections,
		forInArrays,
		functionAssignments,
		functionCurryingRedundancy,
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
		objectCalls,
		objectHasOwns,
		objectKeyDuplicates,
		objectProto,
		objectPrototypeBuiltIns,
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
		unnecessaryBlocks,
		unnecessaryCatches,
		unnecessaryConcatenation,
		unsafeNegations,
		variableDeletions,
		voidOperator,
		withStatements,
	],
});
