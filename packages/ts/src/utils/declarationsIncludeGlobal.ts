import type * as ts from "typescript";

import { declarationIncludesGlobal } from "./declarationIncludesGlobal.ts";

export function declarationsIncludeGlobal(declarations: ts.Declaration[]) {
	return declarations.some(declarationIncludesGlobal);
}
