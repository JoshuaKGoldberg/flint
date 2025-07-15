import { NormalizedRuleReport } from "./reports.js";
import {
	AnyRule,
	AnyRuleDefinition,
	Rule,
	RuleAbout,
	RuleDefinition,
} from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export type AnyLanguage = Language<object, object>;

export interface CreateRule<AstNodesByName, ContextServices extends object> {
	<const About extends RuleAbout, const MessageId extends string>(
		definition: RuleDefinition<
			About,
			AstNodesByName,
			ContextServices,
			MessageId,
			undefined
		>,
	): Rule<About, AstNodesByName, ContextServices, MessageId, undefined>;

	<
		const About extends RuleAbout,
		const MessageId extends string,
		const OptionsSchema extends AnyOptionalSchema,
	>(
		definition: RuleDefinition<
			About,
			AstNodesByName,
			ContextServices,
			MessageId,
			OptionsSchema
		>,
	): Rule<About, AstNodesByName, ContextServices, MessageId, OptionsSchema>;
}

export interface Language<AstNodesByName, ContextServices extends object>
	extends LanguageDefinition {
	createRule: CreateRule<AstNodesByName, ContextServices>;
	prepare(): LanguageFileFactory;
}

export interface LanguageAbout {
	name: string;
}

export type LanguageDiagnostics = LanguageFileDiagnostic[];

export interface LanguageFileDiagnostic {
	code: string;
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
	runRule<
		OptionsSchema extends AnyOptionalSchema | undefined =
			| AnyOptionalSchema
			| undefined,
	>(
		rule: AnyRule<RuleAbout, OptionsSchema>,
		options: InferredObject<OptionsSchema>,
	): Promise<NormalizedRuleReport[]>;
}

/**
 * Internal definition of how to wrap a file to be linted by any number of rules.
 */
export interface LanguageFileDefinition extends Partial<Disposable> {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	runRule<
		OptionsSchema extends AnyOptionalSchema | undefined =
			| AnyOptionalSchema
			| undefined,
	>(
		rule: AnyRuleDefinition<OptionsSchema>,
		options: InferredObject<OptionsSchema>,
	): Promise<NormalizedRuleReport[]>;
}

/**
 * Creates wrappers around files to be linted.
 */
export interface LanguageFileFactory extends Disposable {
	prepareFileOnDisk(filePathAbsolute: string): LanguageFile;
	prepareFileVirtually(
		filePathAbsolute: string,
		sourceText: string,
	): LanguageFile;
}

/**
 * Internal definition of how to create wrappers around files to be linted.
 */
export interface LanguageFileFactoryDefinition extends Partial<Disposable> {
	prepareFileOnDisk(filePathAbsolute: string): LanguageFileDefinition;
	prepareFileVirtually(
		filePathAbsolute: string,
		sourceText: string,
	): LanguageFileDefinition;
}
