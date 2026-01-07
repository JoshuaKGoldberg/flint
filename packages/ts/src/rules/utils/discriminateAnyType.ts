import * as tsutils from "ts-api-utils";
import ts from "typescript";

import type { Checker } from "../../types/checker.ts";

export const AnyType = {
	Any: "Any",
	AnyArray: "AnyArray",
	PromiseAny: "PromiseAny",
	Safe: "Safe",
} as const;
export type AnyType = (typeof AnyType)[keyof typeof AnyType];

/**
 * @returns `AnyType.Any` if the type is `any`, `AnyType.AnyArray` if the type is `any[]` or `readonly any[]`, `AnyType.PromiseAny` if the type is `Promise&lt;any>`,
 * otherwise it returns `AnyType.Safe`.
 */
export function discriminateAnyType(
	type: ts.Type,
	checker: Checker,
	program: ts.Program,
	tsNode: ts.Node,
): AnyType {
	return discriminateAnyTypeWorker(type, checker, program, tsNode, new Set());
}

function discriminateAnyTypeWorker(
	type: ts.Type,
	checker: Checker,
	program: ts.Program,
	tsNode: ts.Node,
	visited: Set<ts.Type>,
) {
	if (visited.has(type)) {
		return AnyType.Safe;
	}
	visited.add(type);
	if (tsutils.isTypeFlagSet(type, ts.TypeFlags.Any)) {
		return AnyType.Any;
	}
	if (
		checker.isArrayType(type) &&
		tsutils.isTypeFlagSet(checker.getTypeArguments(type)[0], ts.TypeFlags.Any)
	) {
		return AnyType.AnyArray;
	}
	for (const part of tsutils.typeConstituents(type)) {
		if (tsutils.isThenableType(checker, tsNode, part)) {
			const awaitedType = checker.getAwaitedType(part);
			if (awaitedType) {
				const awaitedAnyType = discriminateAnyTypeWorker(
					awaitedType,
					checker,
					program,
					tsNode,
					visited,
				);
				if (awaitedAnyType === AnyType.Any) {
					return AnyType.PromiseAny;
				}
			}
		}
	}

	return AnyType.Safe;
}
