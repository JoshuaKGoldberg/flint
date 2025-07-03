import { FormattingResults } from "./formatting.js";
import { RunConfigResultsMaybeWithFixes } from "./linting.js";

export interface Presenter {
	begin(configFileName: string): void;
	end(
		configResults: RunConfigResultsMaybeWithFixes,
		formattingResults: FormattingResults,
	): void;
}
