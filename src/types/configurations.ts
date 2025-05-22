import { AnyRuleDefinition } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export interface RuleConfiguration<
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options?: InferredObject<OptionsSchema>;
	rule: AnyRuleDefinition<OptionsSchema>;
}
