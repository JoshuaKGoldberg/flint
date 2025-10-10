import { ruleTester } from "./ruleTester.js";
import rule from "./symbolDescriptions.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const symbol = Symbol();
`,
			snapshot: `
const symbol = Symbol();
               ~~~~~~~~
               Symbols should have descriptions for easier debugging.
`,
		},
		{
			code: `
const uniqueKey = Symbol();
`,
			snapshot: `
const uniqueKey = Symbol();
                  ~~~~~~~~
                  Symbols should have descriptions for easier debugging.
`,
		},
		{
			code: `
const symbols = [Symbol(), Symbol()];
`,
			snapshot: `
const symbols = [Symbol(), Symbol()];
                 ~~~~~~~~
                 Symbols should have descriptions for easier debugging.
                           ~~~~~~~~
                           Symbols should have descriptions for easier debugging.
`,
		},
		{
			code: `
function createSymbol() {
	return Symbol();
}
`,
			snapshot: `
function createSymbol() {
	return Symbol();
        ~~~~~~~~
        Symbols should have descriptions for easier debugging.
}
`,
		},
		{
			code: `
const obj = {
	key: Symbol(),
};
`,
			snapshot: `
const obj = {
	key: Symbol(),
      ~~~~~~~~
      Symbols should have descriptions for easier debugging.
};
`,
		},
		{
			code: `
const value = condition ? Symbol() : null;
`,
			snapshot: `
const value = condition ? Symbol() : null;
                          ~~~~~~~~
                          Symbols should have descriptions for easier debugging.
`,
		},
	],
	valid: [
		`const symbol = Symbol("description");`,
		`const uniqueKey = Symbol("uniqueKey");`,
		`const mySymbol = Symbol("my symbol");`,
		`const symbols = [Symbol("first"), Symbol("second")];`,
		`function createSymbol() { return Symbol("created"); }`,
		`const obj = { key: Symbol("key") };`,
		`const value = Symbol.for("global");`,
		`const iterator = Symbol.iterator;`,
		`const hasInstance = Symbol.hasInstance;`,
		`const primitiveValue = Symbol.toPrimitive;`,
		`Symbol("valid")`,
	],
});
