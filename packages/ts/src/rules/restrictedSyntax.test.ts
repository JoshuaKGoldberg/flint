import rule from "./restrictedSyntax.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = 42;
`,
			options: {
				selectors: ["VariableStatement"],
			},
			snapshot: `
const value = 42;
~~~~~~~~~~~~~~~~~
Using 'VariableStatement' is not allowed.
`,
		},
		{
			code: `
for (const item in items) {
    console.log(item);
}
`,
			options: {
				selectors: ["ForInStatement"],
			},
			snapshot: `
for (const item in items) {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'ForInStatement' is not allowed.
    console.log(item);
}
`,
		},
		{
			code: `
function getValue() {
    return 42;
}
`,
			options: {
				selectors: [
					{
						selector: "FunctionDeclaration",
						message: "Use arrow functions instead.",
					},
				],
			},
			snapshot: `
function getValue() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'FunctionDeclaration' is not allowed.
    return 42;
}
`,
		},
		{
			code: `
class MyClass {
    constructor() {}
}
`,
			options: {
				selectors: ["ClassDeclaration"],
			},
			snapshot: `
class MyClass {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'ClassDeclaration' is not allowed.
    constructor() {}
}
`,
		},
		{
			code: `
with (object) {
    property;
}
`,
			options: {
				selectors: ["WithStatement"],
			},
			snapshot: `
with (object) {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'WithStatement' is not allowed.
    property;
}
`,
		},
		{
			code: `
const result = condition ? valueA : valueB;
`,
			options: {
				selectors: ["ConditionalExpression"],
			},
			snapshot: `
const result = condition ? valueA : valueB;
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~
               Using 'ConditionalExpression' is not allowed.
`,
		},
		{
			code: `
try {
    riskyOperation();
} catch (error) {
    handleError(error);
}
`,
			options: {
				selectors: ["TryStatement"],
			},
			snapshot: `
try {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'TryStatement' is not allowed.
    riskyOperation();
} catch (error) {
    handleError(error);
}
`,
		},
		{
			code: `
const value = new Array(10);
`,
			options: {
				selectors: ["NewExpression"],
			},
			snapshot: `
const value = new Array(10);
              ~~~~~~~~~~~~~
              Using 'NewExpression' is not allowed.
`,
		},
		{
			code: `
debugger;
console.log("after debugger");
`,
			options: {
				selectors: ["DebuggerStatement", "ExpressionStatement"],
			},
			snapshot: `
debugger;
~~~~~~~~~
Using 'DebuggerStatement' is not allowed.
console.log("after debugger");
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'ExpressionStatement' is not allowed.
`,
		},
		{
			code: `
enum Status {
    Active,
    Inactive
}
`,
			options: {
				selectors: [
					{
						message: "Prefer using union types instead of enums.",
						selector: "EnumDeclaration",
					},
				],
			},
			snapshot: `
enum Status {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'EnumDeclaration' is not allowed.
    Active,
    Inactive
}
`,
		},
		{
			code: `
namespace Utils {
    export function helper() {}
}
`,
			options: {
				selectors: ["ModuleDeclaration"],
			},
			snapshot: `
namespace Utils {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using 'ModuleDeclaration' is not allowed.
    export function helper() {}
}
`,
		},
		{
			code: `
const message = \`Hello, \${name}!\`;
`,
			options: {
				selectors: ["TemplateExpression"],
			},
			snapshot: `
const message = \`Hello, \${name}!\`;
                ~~~~~~~~~~~~~~~~~
                Using 'TemplateExpression' is not allowed.
`,
		},
		{
			code: `
const result = valueA && valueB;
`,
			options: {
				selectors: [
					{
						message: "Avoid using logical AND in expressions.",
						selector: "BinaryExpression",
					},
				],
			},
			snapshot: `
const result = valueA && valueB;
               ~~~~~~~~~~~~~~~~
               Using 'BinaryExpression' is not allowed.
`,
		},
	],
	valid: [
		{
			code: `const value = 42;`,
			options: { selectors: [] },
		},
		{
			code: `const value = 42;`,
			options: { selectors: ["FunctionDeclaration"] },
		},
		{
			code: `
function getValue() {
    return 42;
}
`,
			options: { selectors: ["ClassDeclaration"] },
		},
		{
			code: `
class MyClass {
    constructor() {}
}
`,
			options: { selectors: ["FunctionDeclaration"] },
		},
		{
			code: `
for (const item of items) {
    console.log(item);
}
`,
			options: { selectors: ["ForInStatement"] },
		},
		{
			code: `
const result = valueA || valueB;
`,
			options: { selectors: ["ConditionalExpression"] },
		},
		{
			code: `
try {
    riskyOperation();
} catch (error) {
    handleError(error);
}
`,
			options: { selectors: ["WithStatement"] },
		},
		{
			code: `
const values = [1, 2, 3];
`,
			options: { selectors: ["NewExpression"] },
		},
		{
			code: `
type Status = "Active" | "Inactive";
`,
			options: { selectors: ["EnumDeclaration"] },
		},
		{
			code: `
export function helper() {}
`,
			options: { selectors: ["ModuleDeclaration"] },
		},
		{
			code: `
const message = "Hello, " + name + "!";
`,
			options: { selectors: ["TemplateExpression"] },
		},
	],
});
