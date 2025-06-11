import { AnyRuleDefinition } from "./rules.js";

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

export type ConfigRuleDefinition =
	| AnyRuleDefinition
	| ConfigRuleDefinitionObject;

export interface ConfigRuleDefinitionObject {
	options: unknown;
	rule: AnyRuleDefinition;
}

export interface ConfigUseDefinition {
	exclude?: string;
	glob: AnyLevelArray<string> | string;
	rules: AnyLevelArray<ConfigRuleDefinition>;
}

export interface NormalizedConfigUseDefinition extends ConfigUseDefinition {
	glob: string[];
	rules: ConfigRuleDefinition[];
}
