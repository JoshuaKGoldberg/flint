import { AnyLevelDeep } from "../types/arrays.js";

export function flatten<T>(values: AnyLevelDeep<T>): T[] {
	if (!Array.isArray(values)) {
		return [values];
	}

	return values.flat(Infinity as 0) as T[];
}
