import { tryCatch } from "../../utils/tryCatch.js";
import { stylisticComment } from "../blockESLintMoreStyling.js";
import { zRuleOptions } from "./schemas.js";
import JSON5 from "json5";
import { AST_NODE_TYPES, parse } from "@typescript-eslint/typescript-estree";

//#region src/blocks/eslint/blockESLintIntake.ts
function blockESLintIntake(sourceText) {
	const configExport = tryCatch(() => parse(sourceText, {
		comment: true,
		loc: true,
		range: true
	}))?.body.find(nodeIsConfigExport);
	if (!configExport) return;
	const configArguments = configExport.declaration.arguments;
	if (configArguments.length < 2) return;
	const ignores = getConfigIgnores(configArguments[0]);
	if (!ignores) return;
	const rulesObject = getConfigRulesObject(configArguments.slice(1));
	if (!rulesObject) return;
	const rules = collectRulesObjectGroups(sourceText, rulesObject);
	if (!rules) return;
	return {
		ignores,
		rules
	};
	function areArraysEqual(a, b) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
		return true;
	}
	function collectRuleFromProperty(property) {
		if (property.type !== AST_NODE_TYPES.Property || property.key.type !== AST_NODE_TYPES.Literal || typeof property.key.value !== "string") return;
		const name = property.key.value;
		const { data } = zRuleOptions.safeParse(JSON5.parse(sourceText.slice(...property.value.range)));
		return data && {
			entry: data,
			name
		};
	}
	function collectRulesObjectGroups(sourceText$1, rulesObject$1) {
		let previousNode;
		let currentGroup;
		const groups = [];
		for (const property of rulesObject$1.properties) {
			const comment = sourceText$1.slice((previousNode?.range[1] ?? rulesObject$1.range[0]) + 1, property.range[0]).replaceAll(/\/\/ ?|\t\s*/g, "").trim() || void 0;
			if (comment === stylisticComment) break;
			const rule = collectRuleFromProperty(property);
			if (!rule) return;
			if (!currentGroup || comment) {
				currentGroup = {
					comment,
					entries: {}
				};
				groups.push(currentGroup);
			}
			currentGroup.entries[rule.name] = rule.entry;
			previousNode = property;
		}
		return groups;
	}
	function getConfigIgnores(node) {
		return node.type === AST_NODE_TYPES.ObjectExpression && node.properties.length === 1 && node.properties[0].type === AST_NODE_TYPES.Property && node.properties[0].key.type === AST_NODE_TYPES.Identifier && node.properties[0].key.name === "ignores" && node.properties[0].value.type === AST_NODE_TYPES.ArrayExpression && node.properties[0].value.elements.every((element) => element?.type === AST_NODE_TYPES.Literal && typeof element.value === "string") && node.properties[0].value.elements.map((element) => element.value);
	}
	function getConfigRulesObject(nodes) {
		const configObject = nodes.find((node) => node.type === AST_NODE_TYPES.ObjectExpression && areArraysEqual(node.properties.map((property) => property.type === AST_NODE_TYPES.Property && property.key.type === AST_NODE_TYPES.Identifier ? property.key.name : void 0), [
			"extends",
			"files",
			"languageOptions",
			"rules",
			"settings"
		]));
		if (!configObject) return;
		const rulesObject$1 = configObject.properties[3];
		return rulesObject$1.type === AST_NODE_TYPES.Property && rulesObject$1.value.type === AST_NODE_TYPES.ObjectExpression && rulesObject$1.value;
	}
	function nodeIsConfigExport(node) {
		return node.type === AST_NODE_TYPES.ExportDefaultDeclaration && node.declaration.type === AST_NODE_TYPES.CallExpression && nodeIsConfigFunction(node.declaration.callee);
	}
	function nodeIsConfigFunction(node) {
		return node.type === AST_NODE_TYPES.MemberExpression && node.object.type === AST_NODE_TYPES.Identifier && node.object.name === "tseslint" && node.property.type === AST_NODE_TYPES.Identifier && node.property.name === "config";
	}
}

//#endregion
export { blockESLintIntake };
//# sourceMappingURL=blockESLintIntake.js.map