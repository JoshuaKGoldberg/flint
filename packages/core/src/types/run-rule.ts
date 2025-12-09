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
	const FileContext extends object,
>(
	runtime: RuleRuntime<AstNodesByName, MessageId, ContextServices, FileContext>,
	messages: Record<MessageId, ReportMessageData>,
) => Promise<NormalizedReport[]>;

type Visit<AstNodesByName, ContextServices extends object> = <
	MessageId extends string,
	FileContext extends object,
>(
	visitors: RuleVisitors<
		AstNodesByName,
		MessageId,
		ContextServices & FileContext
	>,
	context: ContextServices & FileContext & RuleContext<MessageId>,
) => void;

export function createRuleRunner<
	const AstNodesByName,
	const ContextServices extends object,
>(
	services: ContextServices,
	visit: Visit<AstNodesByName, ContextServices>,
	createRange: (range: CharacterReportRange) => NormalizedReportRangeObject,
): RuleRunner<AstNodesByName, ContextServices> {
	return async function runRule<
		const MessageId extends string,
		const FileContext extends object,
	>(
		runtime: RuleRuntime<
			AstNodesByName,
			MessageId,
			ContextServices,
			FileContext
		>,
		messages: Record<MessageId, ReportMessageData>,
	): Promise<NormalizedReport[]> {
		const reports: NormalizedReport[] = [];

		if (await runtime.skipFile(services)) {
			return [];
		}

		const fileContext = await runtime.fileSetup(services);

		const context: ContextServices & FileContext & RuleContext<MessageId> = {
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
			...fileContext,
		};

		visit(runtime.visitors, context);

		return reports;
	};
}
