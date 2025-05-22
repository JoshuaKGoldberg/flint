import type * as ts from "typescript";

import { RuleReport } from "./reports.js";

export interface RuleContext<Message extends string> {
	report: RuleReporter<Message>;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export type RuleReporter<Message extends string> = (
	report: RuleReport<Message>,
) => void;
