export class FlintAssertionError extends Error {
	constructor(message: string) {
		super(
			`Flint bug: ${message}. Please report it here: https://github.com/flint-fyi/flint/issues`,
		);
	}
}
export function assert(x: unknown, message: string): asserts x {
	if (!x) {
		throw new FlintAssertionError(message);
	}
}

export function nullThrows<T>(x: T, message: string): NonNullable<T> {
	assert(x != null, message);
	return x;
}
