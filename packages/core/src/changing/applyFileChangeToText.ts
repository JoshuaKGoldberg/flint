import { FileChange } from "../types/changes.js";

export function applyFileChangeToText(fileChange: FileChange, text: string) {
	return (
		text.slice(0, fileChange.range.begin) +
		fileChange.text +
		text.slice(fileChange.range.end)
	);
}
