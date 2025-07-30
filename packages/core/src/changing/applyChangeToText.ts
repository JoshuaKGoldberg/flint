import { FileChange } from "../types/changes.js";

export function applyFileChangeToText(change: FileChange, text: string) {
	return (
		text.slice(0, change.range.begin) +
		change.text +
		text.slice(change.range.end)
	);
}
