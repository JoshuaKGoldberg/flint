import type { CommentDirective } from "./directives.ts";
import type { CharacterReportRange } from "./ranges.ts";
import type { FileReport, NormalizedReportRangeObject } from "./reports.ts";
import type {
	AnyRuleRuntime,
	Rule,
	RuleAbout,
	RuleDefinition,
} from "./rules.ts";
import type { AnyOptionalSchema, InferredObject } from "./shapes.ts";

export type AnyLanguage = Language<object, object>;

export interface CreateRule<AstNodesByName, FileServices extends object> {
	<const About extends RuleAbout, const MessageId extends string>(
		definition: RuleDefinition<
			About,
			AstNodesByName,
			FileServices,
			MessageId,
			undefined
		>,
	): Rule<About, AstNodesByName, FileServices, MessageId, undefined>;

	<
		const About extends RuleAbout,
		const MessageId extends string,
		const OptionsSchema extends AnyOptionalSchema,
	>(
		definition: RuleDefinition<
			About,
			AstNodesByName,
			FileServices,
			MessageId,
			OptionsSchema
		>,
	): Rule<About, AstNodesByName, FileServices, MessageId, OptionsSchema>;
}

export interface Language<
	AstNodesByName,
	FileServices extends object,
> extends LanguageDefinition {
	createRule: CreateRule<AstNodesByName, FileServices>;
	prepare(): LanguageFileFactory;
}

export interface LanguageAbout {
	name: string;
}

export type LanguageDiagnostics = LanguageFileDiagnostic[];

export interface LanguageFileDiagnostic {
	code?: string;
	text: string;
}

/**
 * The definition of a language, as provided to language creators internally.
 */
export interface LanguageDefinition {
	about: LanguageAbout;
	prepare(): LanguageFileFactoryDefinition;
}

export interface LanguageFileCacheImpacts {
	dependencies: string[];
}

/**
 * Wraps a file to be linted by any number of rules.
 */
export interface LanguageFile extends Disposable {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	normalizeRange(range: CharacterReportRange): NormalizedReportRangeObject;
	runVisitors<
		OptionsSchema extends AnyOptionalSchema | undefined =
			| AnyOptionalSchema
			| undefined,
	>(
		ruleRuntime: AnyRuleRuntime<InferredObject<OptionsSchema>>,
		options: InferredObject<OptionsSchema>,
	): void;
}

/**
 * Internal definition of how to wrap a file to be linted by any number of rules.
 */
export interface LanguageFileDefinition extends Partial<Disposable> {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	normalizeRange(range: CharacterReportRange): NormalizedReportRangeObject;
	runVisitors<
		OptionsSchema extends AnyOptionalSchema | undefined =
			| AnyOptionalSchema
			| undefined,
	>(
		ruleRuntime: AnyRuleRuntime<InferredObject<OptionsSchema>>,
		options: InferredObject<OptionsSchema>,
	): void;
}

/**
 * Creates wrappers around files to be linted.
 */
export interface LanguageFileFactory extends Disposable {
	prepareFromDisk(filePathAbsolute: string): LanguagePrepared;
	prepareFromVirtual(
		filePathAbsolute: string,
		sourceText: string,
	): LanguagePrepared;
}

/**
 * Prepared information about a file to be linted.
 */
export interface LanguagePrepared {
	directives?: CommentDirective[];
	file: LanguageFile;
	reports?: FileReport[];
}

/**
 * Internal definition of how to create wrappers around files to be linted.
 */
export interface LanguageFileFactoryDefinition extends Partial<Disposable> {
	prepareFromDisk(filePathAbsolute: string): LanguagePreparedDefinition;
	prepareFromVirtual(
		filePathAbsolute: string,
		sourceText: string,
	): LanguagePreparedDefinition;
}

/**
 * Internal definition of prepared information about a file to be linted.
 */
export interface LanguagePreparedDefinition {
	directives?: CommentDirective[];
	file: LanguageFileDefinition;
	reports?: FileReport[];
}
