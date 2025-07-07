import { FormattingResults } from "./formatting.js";
import { RunConfigResultsMaybeWithFixes } from "./linting.js";
import { RunMode } from "./modes.js";
import { FileRuleReport } from "./reports.js";

export interface PresenterAbout {
	name: string;
}

export interface PresenterFactory {
	about: PresenterAbout;
	initialize(context: PresenterInitializeContext): PresenterInitialized;
}

export interface PresenterInitializeContext {
	configFileName: string;
	runMode: RunMode;
}

export interface PresenterInitialized {
	header: string;
	runtime: PresenterRuntime;
}

export interface PresenterRuntime {
	renderFile(context: PresenterRuntimeFileContext): RenderGenerator;
	summarize(context: PresenterRuntimeSummarizeContext): RenderGenerator;
}

export interface PresenterRuntimeFileContext {
	file: PresenterVirtualFile;
	reports: FileRuleReport[];
}

export interface PresenterRuntimeSummarizeContext {
	configResults: RunConfigResultsMaybeWithFixes;
	formattingResults: FormattingResults;
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
