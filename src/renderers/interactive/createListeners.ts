export function createListeners() {
	const listeners = new Set<() => void>();

	return {
		add(callback: () => void) {
			listeners.add(callback);
		},
		call() {
			for (const listener of listeners) {
				listener();
			}
		},
	};
}
