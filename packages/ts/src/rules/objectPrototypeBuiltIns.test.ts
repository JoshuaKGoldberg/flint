import rule from "./objectPrototypeBuiltIns.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const has = object.hasOwnProperty("key");
`,
			snapshot: `
const has = object.hasOwnProperty("key");
                   ~~~~~~~~~~~~~~
                   Use Object.prototype.hasOwnProperty.call() instead of calling hasOwnProperty directly on an object.
`,
			suggestions: [
				{
					id: "use-prototype-call",
					updated: `
const has = Object.prototype.hasOwnProperty.call(object, "key");
`,
				},
			],
		},
		{
			code: `
const isPrototype = object.isPrototypeOf(other);
`,
			snapshot: `
const isPrototype = object.isPrototypeOf(other);
                           ~~~~~~~~~~~~~
                           Use Object.prototype.isPrototypeOf.call() instead of calling isPrototypeOf directly on an object.
`,
			suggestions: [
				{
					id: "use-prototype-call",
					updated: `
const isPrototype = Object.prototype.isPrototypeOf.call(object, other);
`,
				},
			],
		},
		{
			code: `
const isEnum = object.propertyIsEnumerable("prop");
`,
			snapshot: `
const isEnum = object.propertyIsEnumerable("prop");
                      ~~~~~~~~~~~~~~~~~~~~
                      Use Object.prototype.propertyIsEnumerable.call() instead of calling propertyIsEnumerable directly on an object.
`,
			suggestions: [
				{
					id: "use-prototype-call",
					updated: `
const isEnum = Object.prototype.propertyIsEnumerable.call(object, "prop");
`,
				},
			],
		},
		{
			code: `
if (data.hasOwnProperty(key)) {
    process(data[key]);
}
`,
			snapshot: `
if (data.hasOwnProperty(key)) {
         ~~~~~~~~~~~~~~
         Use Object.prototype.hasOwnProperty.call() instead of calling hasOwnProperty directly on an object.
    process(data[key]);
}
`,
			suggestions: [
				{
					id: "use-prototype-call",
					updated: `
if (Object.prototype.hasOwnProperty.call(data, key)) {
    process(data[key]);
}
`,
				},
			],
		},
	],
	valid: [
		`const has = Object.prototype.hasOwnProperty.call(object, "key");`,
		`const isPrototype = Object.prototype.isPrototypeOf.call(object, other);`,
		`const isEnum = {}.propertyIsEnumerable.call(object, "prop");`,
		`const value = object.someOtherMethod("key");`,
		`const result = hasOwnProperty("key");`,
	],
});
