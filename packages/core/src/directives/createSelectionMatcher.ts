// TODO: There's got to be a better way.
// Maybe an existing common one like minimatch?
export function createSelectionMatcher(selection: string) {
	return new RegExp(`^${selection.replaceAll("*", ".*")}$`);
}
