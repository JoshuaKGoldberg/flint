import { CharacterReportRange } from "@flint.fyi/core";
import { Mapper as VolarMapper } from "@volar/language-core";
import * as vue from "@vue/compiler-core";
import ts from "typescript";

import { vueLanguage } from "../language.js";

export default vueLanguage.createRule({
	about: {
		description: "Reports v-for directives without a valid key binding.",
		id: "vForKey",
		preset: "logical",
	},
	messages: {
		invalidKey: {
			primary:
				"The :key on this v-for element does not reference the iteration variable.",
			secondary: [
				"Keys must uniquely identify each item in the v-for loop to maintain object constancy.",
				"Using values unrelated to the loop can still lead to rendering issues during reordering.",
			],
			suggestions: [
				"Bind the :key to something derived from the v-for item, like item.id or the index if no unique identifier exists.",
			],
		},
		missingKey: {
			primary:
				"Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.",
			secondary: [
				"A missing :key can cause unpredictable updates during rendering optimizations.",
				"Without a key, Vue may reuse or reorder elements incorrectly, which breaks expected behavior in transitions and stateful components.",
			],
			suggestions: [
				"Always provide a unique :key based on the v-for item, such as an id.",
			],
		},
		staticKey: {
			primary:
				"Static key values prevent Vue from tracking changes in v-for lists.",
			secondary: [
				'Using key="literal" means every item in the v-for shares the same key, which prevents Vue from tracking list updates correctly.',
				"This blocks proper reactivity, leading to stale DOM content and skipped updates.",
			],
			suggestions: [
				"Replace the static key with a dynamic and unique :key derived from the v-for item, such as item.id.",
			],
		},
	},
	setup(context) {
		const { vueServices } = context;
		if (vueServices == null) {
			return {};
		}
		const {
			sfc: { template: templateTransformed },
			templateAst,
		} = vueServices;
		if (templateAst == null || templateTransformed == null) {
			return {};
		}
		const { startTagEnd } = templateTransformed;

		const propValueRange = (propValue: vue.TextNode) => {
			const strip = propValue.loc.source === propValue.content ? 0 : 1;
			return {
				begin: propValue.loc.start.offset + strip + startTagEnd,
				end: propValue.loc.end.offset - strip + startTagEnd,
			};
		};

		const checkFor = (
			forDirective: vue.DirectiveNode,
			forParseResult: vue.ForParseResult,
			keyProp: null | vue.AttributeNode | vue.DirectiveNode,
		) => {
			if (keyProp == null) {
				vueServices.reportSfc({
					message: "missingKey",
					range: {
						begin: forDirective.loc.start.offset + startTagEnd,
						end: forDirective.loc.start.offset + startTagEnd + "v-for".length,
					},
				});
				return;
			}
			if (keyProp.type === vue.NodeTypes.ATTRIBUTE) {
				if (keyProp.value == null) {
					return; // TS error
				}
				vueServices.reportSfc({
					message: "staticKey",
					range: propValueRange(keyProp.value),
				});
				return;
			}

			if (keyProp.arg == null) {
				throw new Error("Expected keyProp.arg to be non-null");
			}

			let reportRange: CharacterReportRange;
			let valueRange: CharacterReportRange;

			if (keyProp.exp == null) {
				// :key
				reportRange = {
					begin: keyProp.loc.start.offset + startTagEnd,
					end: keyProp.loc.end.offset + startTagEnd,
				};
				const generatedLocations = Array.from(
					vueServices.map.toGeneratedLocation(
						keyProp.arg.loc.start.offset + startTagEnd,
					),
				).filter(([, m]) => m.lengths[0] > 0);

				// |key|: |key|
				//        ^^^^^
				// |key|: __VLS_ctx.|key|
				//                  ^^^^^
				const valueMapping = generatedLocations[1][1];

				valueRange = {
					begin: valueMapping.generatedOffsets[0],
					end: valueMapping.generatedOffsets[0] + valueMapping.lengths[0],
				};
			} else {
				reportRange = {
					begin: keyProp.exp.loc.start.offset + startTagEnd,
					end: keyProp.exp.loc.end.offset + startTagEnd,
				};

				const valueBegin = toGeneratedLocation(
					vueServices.map,
					keyProp.exp.loc.start.offset + startTagEnd,
				);
				if (valueBegin == null) {
					// Bug in vue/language-tools: virtual code is not generated for <template :key="">
					// https://github.com/vuejs/language-tools/issues/4539
					// Blocked on:
					// https://github.com/vuejs/core/issues/11322 -> https://github.com/vuejs/core/pull/11323
					return;
				}

				valueRange = {
					begin: valueBegin,
					end: toGeneratedLocationOrThrow(
						vueServices.map,
						keyProp.exp.loc.end.offset + startTagEnd,
					),
				};
			}

			const loopVariableRanges = [
				forParseResult.value,
				forParseResult.key,
				forParseResult.index,
			]
				.filter((v) => v != null)
				.map((v) => ({
					begin: toGeneratedLocationOrThrow(
						vueServices.map,
						v.loc.start.offset + startTagEnd,
					),
					end: toGeneratedLocationOrThrow(
						vueServices.map,
						v.loc.end.offset + startTagEnd,
					),
				}));

			// TODO(perf): use ScopeManager instead
			// https://github.com/JoshuaKGoldberg/flint/issues/400
			const find = (current: ts.Node) => {
				const currentBegin = current.getStart(context.sourceFile);
				const currentEnd = current.getEnd();
				if (currentBegin > valueRange.end || currentEnd <= valueRange.begin) {
					return false;
				}
				if (
					currentBegin >= valueRange.begin &&
					currentEnd <= valueRange.end &&
					ts.isIdentifier(current)
				) {
					const symbol = context.typeChecker.getSymbolAtLocation(current);
					if (symbol?.valueDeclaration == null) {
						return false;
					}
					const declStart = symbol.valueDeclaration.getStart(
						context.sourceFile,
					);
					const declEnd = symbol.valueDeclaration.getEnd();

					return loopVariableRanges.some(
						({ begin, end }) => declStart >= begin && declEnd <= end,
					);
				}

				return current.getChildren(context.sourceFile).some(find);
			};

			if (!find(context.sourceFile)) {
				vueServices.reportSfc({
					message: "invalidKey",
					range: reportRange,
				});
			}
		};

		function visitTag(node: vue.TemplateChildNode) {
			if (node.type === vue.NodeTypes.ELEMENT) {
				let forDirective: null | vue.DirectiveNode = null;
				let forParseResult: null | vue.ForParseResult = null;
				let keyProp: null | vue.AttributeNode | vue.DirectiveNode = null;

				for (const prop of node.props) {
					if (
						prop.type === vue.NodeTypes.DIRECTIVE &&
						prop.name === "for" &&
						prop.forParseResult != null
					) {
						forDirective = prop;
						forParseResult = prop.forParseResult;
					} else if (
						prop.type === vue.NodeTypes.DIRECTIVE &&
						prop.name === "bind" &&
						vue.isStaticArgOf(prop.arg, "key")
					) {
						keyProp = prop;
					} else if (
						prop.type === vue.NodeTypes.ATTRIBUTE &&
						prop.name === "key"
					) {
						keyProp = prop;
					}
				}

				if (forDirective != null && forParseResult != null) {
					checkFor(forDirective, forParseResult, keyProp);
				}

				node.children.forEach(visitTag);
			}
		}
		templateAst.children.forEach(visitTag);

		return {};
	},
});

function toGeneratedLocation(
	map: VolarMapper,
	sourceLocation: number,
): number | undefined {
	return Array.from(map.toGeneratedLocation(sourceLocation))?.[0]?.[0];
}
function toGeneratedLocationOrThrow(
	map: VolarMapper,
	sourceLocation: number,
): number {
	const generated = toGeneratedLocation(map, sourceLocation);
	if (generated == null) {
		throw new Error(
			`Could not map source location ${sourceLocation} to generated location`,
		);
	}
	return generated;
}
