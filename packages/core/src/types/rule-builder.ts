import type { Language } from "./languages.js";
import type { PromiseOrSync } from "./promises.js";
import type { ReportMessageData } from "./reports.js";
import type {
	FileSetup,
	Rule,
	RuleAbout,
	RuleRuntime,
	RuleVisitors,
} from "./rules.js";
import type { AnyOptionalSchema, InferredObject } from "./shapes.js";

type SkipFile<ContextServices> = (
	context: ContextServices,
) => PromiseOrSync<boolean>;

export class RuleBuilder<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	readonly about?: About;
	readonly dependencies: string[];
	readonly fileSetup: FileSetup<ContextServices, FileContext>;
	readonly language: Language<AstNodesByName, ContextServices>;
	readonly messages?: Record<MessageId, ReportMessageData>;
	readonly options?: OptionsSchema;
	readonly skipFile?: SkipFile<ContextServices>;

	constructor(
		language: Language<AstNodesByName, ContextServices>,
		fileSetup: FileSetup<ContextServices, FileContext>,
		about?: About,
		messages?: Record<MessageId, ReportMessageData>,
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

	buildWithVisitors(
		setup: (
			options: InferredObject<OptionsSchema>,
		) => RuleVisitors<AstNodesByName, MessageId, ContextServices & FileContext>,
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

			language: this.language,
			messages: this.messages,
			options: this.options,
			setup: (options) => {
				return {
					dependencies: this.dependencies,
					fileSetup: this.fileSetup,
					skipFile: this.skipFile ?? (() => false),
					visitors: setup(options),
				} satisfies RuleRuntime<
					AstNodesByName,
					MessageId,
					ContextServices,
					FileContext
				>;
			},
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
		FileContext extends object,
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
			builder.fileSetup,
			about,
			builder.messages,
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
		FileContext extends object,
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
			builder.fileSetup,
			builder.about,
			messages,
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
		FileContext extends object,
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
			builder.fileSetup,
			builder.about,
			builder.messages,
			options,
			builder.skipFile,
			builder.dependencies,
		);

export const skipFile =
	<ContextServices extends object>(skipFile: SkipFile<ContextServices>) =>
	<
		About extends RuleAbout,
		AstNodesByName,
		FileContext extends object,
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
			builder.fileSetup,
			builder.about,
			builder.messages,
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
		FileContext extends object,
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
			builder.fileSetup,
			builder.about,
			builder.messages,
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
		OldFileContext extends object,
		MessageId extends string,
		OptionsSchema extends AnyOptionalSchema | undefined,
	>(
		builder: RuleBuilder<
			About,
			AstNodesByName,
			ContextServices,
			OldFileContext,
			MessageId,
			OptionsSchema
		>,
	) =>
		new RuleBuilder(
			builder.language,
			fileSetup,
			builder.about,
			builder.messages,
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
		object,
		never,
		undefined
	>(language, () => Promise.resolve({}));

//#region TEST
