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
		},
		{
			code: `
const isProto = object.isPrototypeOf(other);
`,
			snapshot: `
const isProto = object.isPrototypeOf(other);
                        ~~~~~~~~~~~~~
                        Use Object.prototype.isPrototypeOf.call() instead of calling isPrototypeOf directly on an object.
`,
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
		},
	],
	valid: [
		`const has = Object.prototype.hasOwnProperty.call(object, "key");`,
		`const isProto = Object.prototype.isPrototypeOf.call(object, other);`,
		`const isEnum = {}.propertyIsEnumerable.call(object, "prop");`,
		`const value = object.someOtherMethod("key");`,
		`const result = hasOwnProperty("key");`,
	],
});
