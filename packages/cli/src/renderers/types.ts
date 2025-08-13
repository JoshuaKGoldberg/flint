import { FormattingResults, LintResults } from "@flint.fyi/core";

import { Presenter } from "../presenters/types.js";

export interface Renderer {
	announce(): void;
	dispose?(): void;
	onQuit?(callback: () => void): void;
	render(context: RendererContext): Promise<void> | undefined;
}

export interface RendererAbout {
	name: string;
}

export interface RendererContext {
	formattingResults: FormattingResults;
	ignoreCache: boolean;
	lintResults: LintResults;
}

export interface RendererFactory {
	about: RendererAbout;
	initialize(presenter: Presenter): Renderer;
}
