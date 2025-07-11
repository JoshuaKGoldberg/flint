import { Config, ConfigDefinition } from "../types/configs.js";

export function defineConfig(definition: ConfigDefinition): Config {
	return {
		definition,
		isFlintConfig: true,
	};
}
