import { FileChange } from "../types/changes.js";
import { applyFileChangeToText } from "./applyFileChangeToText.js";
import { orderChangesLastToFirstWithoutOverlaps } from "./ordering.js";

export function applyChangesToText(changes: FileChange[], text: string) {
	const changesOrdered = orderChangesLastToFirstWithoutOverlaps(changes);

	return changesOrdered.reduce(
		(updatedFileContent, change) =>
			applyFileChangeToText(change, updatedFileContent),
		text,
	);
}
