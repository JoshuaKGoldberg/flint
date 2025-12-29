import type { Config, ConfigDefinition } from "../types/configs.ts";

export function defineConfig(definition: ConfigDefinition): Config {
	return {
		definition,
		isFlintConfig: true,
	};
}
