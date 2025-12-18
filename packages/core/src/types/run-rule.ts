import type { RuleContext } from "./context.js";
import type { CharacterReportRange } from "./ranges.js";
import type {
	NormalizedReport,
	NormalizedReportRangeObject,
	ReportMessageData,
	RuleReport,
} from "./reports.js";
import type { RuleRuntime, RuleVisitors } from "./rules.js";

export type RuleRunner<AstNodesByName, ContextServices extends object> = <
	const MessageId extends string,
	const Options,
>(
	runtime: RuleRuntime<AstNodesByName, MessageId, ContextServices, Options>,
	messages: Record<MessageId, ReportMessageData>,
	options: Options,
) => Promise<NormalizedReport[]>;

type Visit<AstNodesByName, ContextServices extends object> = <
	MessageId extends string,
	Options,
>(
	visitors: RuleVisitors<AstNodesByName, MessageId, ContextServices, Options>,
	context: ContextServices & RuleContext<MessageId>,
	options: Options,
) => void;

export function createRuleRunner<
	const AstNodesByName,
	const ContextServices extends object,
>(
	services: ContextServices,
	visit: Visit<AstNodesByName, ContextServices>,
	createRange: (range: CharacterReportRange) => NormalizedReportRangeObject,
): RuleRunner<AstNodesByName, ContextServices> {
	return async function runRule<const MessageId extends string, Options>(
		runtime: RuleRuntime<AstNodesByName, MessageId, ContextServices, Options>,
		messages: Record<MessageId, ReportMessageData>,
		options: Options,
	): Promise<NormalizedReport[]> {
		const reports: NormalizedReport[] = [];

		if (await runtime.skipFile(services)) {
			return [];
		}

		const context: ContextServices & RuleContext<MessageId> = {
			...services,
			report: (report: RuleReport<MessageId>) => {
				reports.push({
					...report,
					fix:
						report.fix && !Array.isArray(report.fix)
							? [report.fix]
							: report.fix,
					message: messages[report.message],
					range: createRange(report.range),
				});
			},
		};

		visit(runtime.visitors, context, options);

		return reports;
	};
}
