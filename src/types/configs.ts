import { PluginGlob } from "./plugins.js";
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
	exclude?: string;
	glob: AnyLevelArray<PluginGlob> | PluginGlob;
	rules: AnyLevelArray<ConfigRuleDefinition>;
}

export interface NormalizedConfigUseDefinition extends ConfigUseDefinition {
	rules: ConfigRuleDefinition[];
}
