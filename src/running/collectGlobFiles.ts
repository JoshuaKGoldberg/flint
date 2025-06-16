import { AnyLevelArray } from "../types/configs.js";
import { PluginGlob } from "../types/plugins.js";

export function collectGlobFiles(glob: AnyLevelArray<PluginGlob> | PluginGlob) {
	const globs = [glob].flat() as PluginGlob[];

	return globs.flatMap((glob) => glob.files);
}
