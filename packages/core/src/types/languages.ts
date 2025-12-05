import type { CachedFactory } from "cached-factory";

import type { AnyOptionalSchema } from "./shapes.js";

import { CommentDirective } from "./directives.js";
import {
	FileReport,
	NormalizedReport,
	type ReportMessageData,
} from "./reports.js";
import {
	type AnyRuleRuntime,
	Rule,
	RuleAbout,
	RuleDefinition,
} from "./rules.js";

export type AnyLanguage = Language<object, object>;

export type CreateRule<AstNodesByName, ContextServices extends object> = <
	const About extends RuleAbout,
	const MessageId extends string,
	const FileContext extends object,
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
	runRule(
		runtime: AnyRuleRuntime,
		messages: Record<string, ReportMessageData>,
	): Promise<NormalizedReport[]>;
}

/**
 * Internal definition of how to wrap a file to be linted by any number of rules.
 */
export interface LanguageFileDefinition extends Partial<Disposable> {
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	runRule(
		runtime: AnyRuleRuntime,
		messages: Record<string, ReportMessageData>,
	): Promise<NormalizedReport[]>;
}

/**
 * Creates wrappers around files to be linted.
 */
export interface LanguageFileFactory extends Disposable {
	prepareFromDisk: CachedFactory<string, LanguagePrepared>;
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
