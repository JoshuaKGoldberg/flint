import { Fix } from "../types/fixes.js";

export const orderFixesLastToFirstWithoutOverlaps = (fixes: Fix[]): Fix[] => {
	const ordered = fixes.toSorted((a, b) => a.range.end - b.range.end);
	const orderedWithoutOverlaps: Fix[] = [];
	let lastStart = Infinity;

	for (let i = ordered.length - 1; i >= 0; i -= 1) {
		const fix = ordered[i];
		if (fix.range.end > lastStart) {
			continue;
		}

		lastStart = fix.range.begin;
		orderedWithoutOverlaps.push(fix);
	}

	return orderedWithoutOverlaps;
};
