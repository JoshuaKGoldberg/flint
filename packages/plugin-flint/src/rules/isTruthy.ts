export function isTruthy<T extends NonNullable<unknown>>(
	value: null | T | undefined,
) {
	return value != null;
}
