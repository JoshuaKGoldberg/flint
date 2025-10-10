import rule from "./classAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class A {}
A = 0;
`,
			snapshot: `
class A {}
A = 0;
~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class MyClass {}
MyClass = "string";
`,
			snapshot: `
class MyClass {}
MyClass = "string";
~~~~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Counter {}
Counter++;
`,
			snapshot: `
class Counter {}
Counter++;
~~~~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Value {}
++Value;
`,
			snapshot: `
class Value {}
++Value;
  ~~~~~
  Class declarations should not be reassigned.
`,
		},
		{
			code: `
class MyClass {}
MyClass += "suffix";
`,
			snapshot: `
class MyClass {}
MyClass += "suffix";
~~~~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Example {}
Example ??= null;
`,
			snapshot: `
class Example {}
Example ??= null;
~~~~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Test {}
Test &&= false;
`,
			snapshot: `
class Test {}
Test &&= false;
~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Data {}
Data ||= null;
`,
			snapshot: `
class Data {}
Data ||= null;
~~~~
Class declarations should not be reassigned.
`,
		},
		{
			code: `
class Outer {}
function inner() {
    Outer = null;
}
`,
			snapshot: `
class Outer {}
function inner() {
    Outer = null;
    ~~~~~
    Class declarations should not be reassigned.
}
`,
		},
		{
			code: `
class MyClass {}
if (true) {
    MyClass = null;
}
`,
			snapshot: `
class MyClass {}
if (true) {
    MyClass = null;
    ~~~~~~~
    Class declarations should not be reassigned.
}
`,
		},
	],
	valid: [
		`class A {}`,
		`class MyClass {} const instance = new MyClass();`,
		`class Counter {} const value = Counter;`,
		`class Example {} if (Example) { console.log(Example); }`,
		`const A = 0;`,
		`class A {} function inner() { const A = "shadowed"; A = "reassigning shadowed is ok"; }`,
		`let A = "outer"; class A {} A = "reassigning outer is ok";`,
		`
class MyClass {}
const derived = class extends MyClass {};
`,
		`
class Base {}
class Derived extends Base {}
`,
		`
class MyClass {}
const instance = new MyClass();
instance.property = "value";
`,
	],
});
