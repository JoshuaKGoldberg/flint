import { AnyRuleDefinition } from "./rules.js";

export type AnyLevelArray<T> = AnyLevelArray<T>[] | T | T[];

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

export interface ConfigUseDefinition {
	exclude?: string;
	glob?: string;
	rules: AnyLevelArray<AnyRuleDefinition>;
}
