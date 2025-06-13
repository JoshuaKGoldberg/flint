export function makeDisposable<T extends object>(obj: T): Disposable & T {
	return {
		...obj,
		[Symbol.dispose]:
			() =>
			// Intentionally empty to satisfy the Disposable interface.
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			() => {},
	};
}

export function makeDisposableCurried<
	Args extends never[],
	Result extends object,
>(creator: (...args: Args) => Result): (...args: Args) => Disposable & Result {
	return (...args: Args) => makeDisposable(creator(...args));
}
