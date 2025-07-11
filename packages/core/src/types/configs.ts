import { AnyRule } from "./rules.js";

export type AnyLevelArray<T> = AnyLevelArray<T>[] | T[];

export interface Config {
	definition: ConfigDefinition;
	isFlintConfig: true;
}

export interface ConfigDefinition {
	from?: string;
	ignore?: string[];
	use: ConfigUseDefinition[];
	workspaces?: string[];
}

export type ConfigRuleDefinition = AnyRule | ConfigRuleDefinitionObject;

export interface ConfigRuleDefinitionObject {
	options: unknown;
	rule: AnyRule;
}

export interface ConfigUseDefinition {
	exclude?: string[];
	glob: AnyLevelArray<string> | string;
	rules?: AnyLevelArray<ConfigRuleDefinition>;
}

/**
 * Representation of a config that's been loaded from disk.
 */
export interface ProcessedConfigDefinition extends ConfigDefinition {
	/**
	 * Original file path of the loaded config file.
	 */
	filePath: string;
}
