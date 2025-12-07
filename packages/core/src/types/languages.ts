import type { CachedFactory } from "cached-factory";

import type { AnyOptionalSchema } from "./shapes.js";

import { CommentDirective } from "./directives.js";
import {
	FileReport,
	NormalizedReport,
	type ReportMessageData,
} from "./reports.js";
import { Rule, RuleAbout, RuleDefinition, type RuleRuntime } from "./rules.js";

export type AnyLanguage = Language<object, object>;

export type CreateRule<AstNodesByName, ContextServices extends object> = <
	const About extends RuleAbout,
	const MessageId extends string,
	const OptionsSchema extends AnyOptionalSchema | undefined = undefined,
>(
	definition: RuleDefinition<
		About,
		AstNodesByName,
		ContextServices,
		undefined,
		MessageId,
		OptionsSchema
	>,
) => Rule<
	About,
	AstNodesByName,
	ContextServices,
	undefined,
	MessageId,
	OptionsSchema
>;

export type CreateStatefulRule<
	AstNodesByName,
	ContextServices extends object,
> = <
	const About extends RuleAbout,
	const MessageId extends string,
	const FileContext extends object | undefined,
	const OptionsSchema extends AnyOptionalSchema | undefined = undefined,
>(
	definition: RuleDefinition<
		About,
		AstNodesByName,
		ContextServices,
		FileContext,
		MessageId,
		OptionsSchema
	>,
) => Rule<
	About,
	AstNodesByName,
	ContextServices,
	FileContext,
	MessageId,
	OptionsSchema
>;

export interface Language<AstNodesByName, ContextServices extends object> {
	about: LanguageAbout;
	createRule: CreateRule<AstNodesByName, ContextServices>;
	createStatefulRule: CreateStatefulRule<AstNodesByName, ContextServices>;
	prepare(): LanguageFileFactory<AstNodesByName, ContextServices>;
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
export interface LanguageDefinition<
	AstNodesByName,
	ContextServices extends object,
> {
	about: LanguageAbout;
	prepare(): LanguageFileFactoryDefinition<AstNodesByName, ContextServices>;
}

export interface LanguageFileCacheImpacts {
	dependencies: string[];
}

/**
 * Wraps a file to be linted by any number of rules.
 */
export interface LanguageFile<AstNodesByName, ContextServices extends object>
	extends Disposable {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	runRule<
		const MessageId extends string,
		const FileContext extends object | undefined,
	>(
		runtime: RuleRuntime<
			AstNodesByName,
			MessageId,
			ContextServices,
			FileContext
		>,
		messages: Record<string, ReportMessageData>,
	): Promise<NormalizedReport[]>;
}

/**
 * Internal definition of how to wrap a file to be linted by any number of rules.
 */
export interface LanguageFileDefinition<
	AstNodesByName,
	ContextServices extends object,
> extends Partial<Disposable> {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	runRule<
		const MessageId extends string,
		const FileContext extends object | undefined,
	>(
		runtime: RuleRuntime<
			AstNodesByName,
			MessageId,
			ContextServices,
			FileContext
		>,
		messages: Record<string, ReportMessageData>,
	): Promise<NormalizedReport[]>;
}

/**
 * Creates wrappers around files to be linted.
 */
export interface LanguageFileFactory<
	AstNodesByName,
	ContextServices extends object,
> extends Disposable {
	prepareFromDisk: CachedFactory<
		string,
		LanguagePrepared<AstNodesByName, ContextServices>
	>;
	prepareFromVirtual(
		filePathAbsolute: string,
		sourceText: string,
	): LanguagePrepared<AstNodesByName, ContextServices>;
}

/**
 * Prepared information about a file to be linted.
 */
export interface LanguagePrepared<
	AstNodesByName,
	ContextServices extends object,
> {
	directives?: CommentDirective[];
	file: LanguageFile<AstNodesByName, ContextServices>;
	reports?: FileReport[];
}

/**
 * Internal definition of how to create wrappers around files to be linted.
 */
export interface LanguageFileFactoryDefinition<
	AstNodesByName,
	ContextServices extends object,
> extends Partial<Disposable> {
	prepareFromDisk(
		filePathAbsolute: string,
	): LanguagePreparedDefinition<AstNodesByName, ContextServices>;
	prepareFromVirtual(
		filePathAbsolute: string,
		sourceText: string,
	): LanguagePreparedDefinition<AstNodesByName, ContextServices>;
}

/**
 * Internal definition of prepared information about a file to be linted.
 */
export interface LanguagePreparedDefinition<
	AstNodesByName,
	ContextServices extends object,
> {
	directives?: CommentDirective[];
	file: LanguageFileDefinition<AstNodesByName, ContextServices>;
	reports?: FileReport[];
}
