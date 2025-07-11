import type * as ts from "typescript";

import { RuleReport } from "./reports.js";

export interface RuleContext<MessageId extends string> {
	report: RuleReporter<MessageId>;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export type RuleReporter<MessageId extends string> = (
	report: RuleReport<MessageId>,
) => void;
