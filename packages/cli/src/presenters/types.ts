import type {
	FileRuleReport,
	FormattingResults,
	LintResultsMaybeWithChanges,
	RunMode,
} from "@flint.fyi/core";

export interface Presenter {
	header: string;
	renderFile(context: PresenterFileContext): RenderGenerator;
	summarize(context: PresenterSummarizeContext): RenderGenerator;
}

export interface PresenterAbout {
	name: string;
}

export interface PresenterFactory {
	about: PresenterAbout;
	initialize(context: PresenterInitializeContext): Presenter;
}

export interface PresenterFileContext {
	file: PresenterVirtualFile;
	reports: FileRuleReport[];
}

export interface PresenterInitializeContext {
	configFileName: string;
	runMode: RunMode;
}

export interface PresenterSummarizeContext {
	formattingResults: FormattingResults;
	lintResults: LintResultsMaybeWithChanges;
}

// TODO: Eventually, the file system should be abstracted
// https://github.com/JoshuaKGoldberg/flint/issues/73
export interface PresenterVirtualFile {
	filePath: string;
	text: string;
}

export type RenderGenerator =
	| AsyncGenerator<string, void, unknown>
	| Generator<string, void, unknown>;
