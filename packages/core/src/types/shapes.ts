import type { z } from "zod";

/**
 * Any object containing Zod schemas that are optional.
 * In other words, allows providing an empty object {} value.
 */
export type AnyOptionalSchema = Record<
	string,
	z.ZodDefault<z.ZodType> | z.ZodOptional<z.ZodType>
>;

/**
 * Given an object containing Zod schemas, produces the equivalent runtime type.
 * @example
 * ```ts
 * InferredObject<{ value: z.ZodNumber }>
 * ```
 * is the same as:
 * ```ts
 * { value: number }
 * ```
 */
export type InferredObject<
	OptionsSchema extends AnyOptionalSchema | undefined,
> = 0 extends 1 & NoInfer<OptionsSchema>
	? // propagate `any`
		OptionsSchema
	: OptionsSchema extends AnyOptionalSchema
		? Partial<z.infer<z.ZodObject<OptionsSchema>>>
		: undefined;
