import type { RuleContext } from "./context.js";
import type { Language } from "./languages.js";
import type { PromiseOrSync } from "./promises.js";
import type {
	NormalizedReport,
	ReportMessageData,
	RuleReport,
} from "./reports.js";
import type { RuleAbout, RuleVisitors } from "./rules.js";
import type { AnyOptionalSchema, InferredObject } from "./shapes.js";

type FileSetup<ContextServices, FileContext> = (
	context: ContextServices,
) => PromiseOrSync<FileContext>;

type RuleSetup<
	AstNodesByName,
	MessageId extends string,
	ContextServices extends object,
	in out FileContext extends object | undefined,
	OptionsSchema extends AnyOptionalSchema | undefined,
> = (
	options: InferredObject<OptionsSchema>,
) => RuleVisitors<
	AstNodesByName,
	MessageId,
	ContextServices & (FileContext extends object ? FileContext : never)
>;

type SkipFile<ContextServices> = (
	context: ContextServices,
) => PromiseOrSync<boolean>;

/**
 * A single lint rule, as used by users in configs.
 */
export interface Rule<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	in out FileContext extends object | undefined,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	dependencies: string[];
	fileSetup?: FileSetup<ContextServices, FileContext>;
	language: Language<AstNodesByName, ContextServices>;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<
		AstNodesByName,
		MessageId,
		ContextServices,
		FileContext,
		OptionsSchema
	>;
	skipFile?: SkipFile<ContextServices>;
}

export class RuleBuilder<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object | undefined,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	readonly about?: About;
	readonly dependencies: string[];
	readonly fileSetup?: FileSetup<ContextServices, FileContext>;
	readonly language: Language<AstNodesByName, ContextServices>;
	readonly messages?: Record<MessageId, ReportMessageData>;
	readonly options?: OptionsSchema;
	readonly skipFile?: SkipFile<ContextServices>;

	constructor(
		language: Language<AstNodesByName, ContextServices>,
		about?: About,
		messages?: Record<MessageId, ReportMessageData>,
		fileSetup?: FileSetup<ContextServices, FileContext>,
		options?: OptionsSchema,
		skipFile?: SkipFile<ContextServices>,
		dependencies: string[] = [],
	) {
		this.language = language;
		this.about = about;
		this.messages = messages;
		this.fileSetup = fileSetup;
		this.options = options;
		this.skipFile = skipFile;
		this.dependencies = dependencies;
	}

	build(
		setup: (
			options: InferredObject<OptionsSchema>,
		) => RuleVisitors<
			AstNodesByName,
			MessageId,
			ContextServices & (FileContext extends object ? FileContext : object)
		>,
	): Rule<
		About,
		AstNodesByName,
		ContextServices,
		FileContext,
		MessageId,
		OptionsSchema
	> {
		if (!this.about || !this.messages) {
			throw new Error("RuleBuilder: Incomplete rule definition");
		}

		return {
			about: this.about,
			dependencies: this.dependencies,
			fileSetup: this.fileSetup,
			language: this.language,
			messages: this.messages,
			options: this.options,
			setup,
			skipFile: this.skipFile,
		};
	}

	pipe<R>(fn: (builder: this) => R): R {
		return fn(this);
	}
}

export const about =
	<const NewAbout extends RuleAbout>(about: NewAbout) =>
	<
		AstNodesByName,
		ContextServices extends object,
		FileContext extends object | undefined,
		MessageId extends string,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			RuleAbout,
			AstNodesByName,
			ContextServices,
			FileContext,
			MessageId,
			OptionsSchema
		>,
	) =>
		new RuleBuilder(
			builder.language,
			about,
			builder.messages,
			builder.fileSetup,
			builder.options,
			builder.skipFile,
			builder.dependencies,
		);

export const messages =
	<const NewMessageId extends string>(
		messages: Record<NewMessageId, ReportMessageData>,
	) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		ContextServices extends object,
		FileContext extends object | undefined,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			FileContext,
			string,
			OptionsSchema
		>,
	): RuleBuilder<
		About,
		AstNodesByName,
		ContextServices,
		FileContext,
		NewMessageId,
		OptionsSchema
	> =>
		new RuleBuilder(
			builder.language,
			builder.about,
			messages,
			builder.fileSetup,
			builder.options,
			builder.skipFile,
			builder.dependencies,
		);

export const options =
	<const NewOptionsSchema extends AnyOptionalSchema>(
		options: NewOptionsSchema,
	) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		ContextServices extends object,
		FileContext extends object | undefined,
		MessageId extends string,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			FileContext,
			MessageId,
			AnyOptionalSchema | undefined
		>,
	): RuleBuilder<
		About,
		AstNodesByName,
		ContextServices,
		FileContext,
		MessageId,
		NewOptionsSchema
	> =>
		new RuleBuilder(
			builder.language,
			builder.about,
			builder.messages,
			builder.fileSetup,
			options,
			builder.skipFile,
			builder.dependencies,
		);

export const skipFile =
	<ContextServices extends object>(skipFile: SkipFile<ContextServices>) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		FileContext extends object | undefined,
		MessageId extends string,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			FileContext,
			MessageId,
			OptionsSchema
		>,
	) =>
		new RuleBuilder(
			builder.language,
			builder.about,
			builder.messages,
			builder.fileSetup,
			builder.options,
			skipFile,
			builder.dependencies,
		);

export const dependencies =
	(dependencies: string[]) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		ContextServices extends object,
		FileContext extends object | undefined,
		MessageId extends string,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			FileContext,
			MessageId,
			OptionsSchema
		>,
	) =>
		new RuleBuilder(
			builder.language,
			builder.about,
			builder.messages,
			builder.fileSetup,
			builder.options,
			builder.skipFile,
			dependencies,
		);

export const stateful =
	<const FileContext extends object, ContextServices extends object>(
		fileSetup: FileSetup<ContextServices, FileContext>,
	) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		MessageId extends string,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			never,
			MessageId,
			OptionsSchema
		>,
	) =>
		new RuleBuilder(
			builder.language,
			builder.about,
			builder.messages,
			fileSetup,
			builder.options,
			builder.skipFile,
			builder.dependencies,
		);

export const createRule = <AstNodesByName, ContextServices extends object>(
	language: Language<AstNodesByName, ContextServices>,
) =>
	new RuleBuilder<
		never,
		AstNodesByName,
		ContextServices,
		never,
		never,
		undefined
	>(language);

//#region TEST

interface TestAstNodesByName {
	file: unknown;
}
interface TestServices {
	truthy: true;
}

async function runTestRule<
	MessageId extends string,
	FileContext extends object | undefined,
	OptionsSchema extends AnyOptionalSchema | undefined = undefined,
>(
	rule: Rule<
		RuleAbout,
		TestAstNodesByName,
		TestServices,
		FileContext,
		MessageId,
		OptionsSchema
	>,
	options: InferredObject<OptionsSchema>,
): Promise<NormalizedReport[]> {
	const reports: NormalizedReport[] = [];

	const services: TestServices = {
		truthy: true,
	};

	if (await rule.skipFile?.(services)) {
		return [];
	}

	const fileContext = await rule.fileSetup?.(services);

	const context: (FileContext extends object ? FileContext : never) &
		RuleContext<MessageId> &
		TestServices = {
		...services,
		report: (report: RuleReport<MessageId>) => {
			reports.push({
				...report,
				fix:
					report.fix && !Array.isArray(report.fix) ? [report.fix] : report.fix,
				message: rule.messages[report.message],
				range: {
					begin: {
						column: 0,
						line: 0,
						raw: 0,
					},
					end: {
						column: 0,
						line: 0,
						raw: 0,
					},
				},
			});
		},
		...((typeof fileContext === "object"
			? fileContext
			: {}) as FileContext extends object ? FileContext : never),
	};

	const visitors = rule.setup(options);
	visitors.file?.({}, context);

	return reports;
}

declare const testLanguage: Language<TestAstNodesByName, TestServices>;

const testRule = createRule(testLanguage)
	.pipe(
		about({
			description: "",
			id: "",
		}),
	)
	.pipe(messages({}))
	.build(() => ({}));

await runTestRule(testRule, undefined);
