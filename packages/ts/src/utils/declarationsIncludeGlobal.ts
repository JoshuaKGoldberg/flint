import * as ts from "typescript";

import { declarationIncludesGlobal } from "./declarationIncludesGlobal.js";

export function declarationsIncludeGlobal(declarations: ts.Declaration[]) {
	return declarations.some(declarationIncludesGlobal);
}
