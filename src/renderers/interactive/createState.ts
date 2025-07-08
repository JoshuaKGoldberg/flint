export function createState<T>(initial: T) {
	let current = initial;

	return [
		() => current,
		(updated: T) => {
			if (current === updated) {
				return false;
			}

			current = updated;
			return true;
		},
	] as const;
}
