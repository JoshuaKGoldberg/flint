import rule from "./classMethodsThis.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		// Basic method without this
		{
			code: `
class A {
	foo() {
		return 1;
	}
}
`,
			snapshot: `
class A {
	foo() {
	~~~
	Method does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		{
			code: `
class A {
	bar(x: number, y: number) {
		return x + y;
	}
}
`,
			snapshot: `
class A {
	bar(x: number, y: number) {
	~~~
	Method does not use \`this\` and could be made static.
		return x + y;
	}
}
`,
		},
		// Arrow function in method doesn't count as using this
		{
			code: `
class A {
	helper() {
		const fn = () => {
			return 42;
		};
		return fn();
	}
}
`,
			snapshot: `
class A {
	helper() {
	~~~~~~
	Method does not use \`this\` and could be made static.
		const fn = () => {
			return 42;
		};
		return fn();
	}
}
`,
		},
		// Inner function's this doesn't count for outer method
		{
			code: `
class A {
	process() {
		function inner() {
			return this;
		}
		return 1;
	}
}
`,
			snapshot: `
class A {
	process() {
	~~~~~~~
	Method does not use \`this\` and could be made static.
		function inner() {
			return this;
		}
		return 1;
	}
}
`,
		},
		// Getter without this
		{
			code: `
class A {
	get value() {
		return 1;
	}
}
`,
			snapshot: `
class A {
	get value() {
	    ~~~~~
	    Accessor does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		// Setter without this
		{
			code: `
class A {
	set value(v: number) {
		console.log(v);
	}
}
`,
			snapshot: `
class A {
	set value(v: number) {
	    ~~~~~
	    Accessor does not use \`this\` and could be made static.
		console.log(v);
	}
}
`,
		},
		// Class field with arrow function (enforceForClassFields default true)
		{
			code: `
class A {
	foo = () => {
		return 1;
	};
}
`,
			snapshot: `
class A {
	foo = () => {
	~~~
	Class field function does not use \`this\` and could be made static.
		return 1;
	};
}
`,
		},
		// Class field with function expression
		{
			code: `
class A {
	foo = function() {
		return 1;
	};
}
`,
			snapshot: `
class A {
	foo = function() {
	~~~
	Class field function does not use \`this\` and could be made static.
		return 1;
	};
}
`,
		},
		// Private method without this
		{
			code: `
class A {
	#privateMethod() {
		return 1;
	}
}
`,
			snapshot: `
class A {
	#privateMethod() {
	~~~~~~~~~~~~~~
	Method does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		// exceptMethods doesn't match
		{
			code: `
class A {
	foo() {
		return 1;
	}
}
`,
			options: { exceptMethods: ["bar"] },
			snapshot: `
class A {
	foo() {
	~~~
	Method does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		// ignoreClassesThatImplementAnInterface: "public-fields" still reports private
		{
			code: `
interface I {}
class A implements I {
	#privateMethod() {
		return 1;
	}
}
`,
			options: { ignoreClassesThatImplementAnInterface: "public-fields" },
			snapshot: `
interface I {}
class A implements I {
	#privateMethod() {
	~~~~~~~~~~~~~~
	Method does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		// ignoreClassesThatImplementAnInterface: "public-fields" still reports protected
		{
			code: `
interface I {}
class A implements I {
	protected foo() {
		return 1;
	}
}
`,
			options: { ignoreClassesThatImplementAnInterface: "public-fields" },
			snapshot: `
interface I {}
class A implements I {
	protected foo() {
	          ~~~
	          Method does not use \`this\` and could be made static.
		return 1;
	}
}
`,
		},
		// Private class field without this
		{
			code: `
class A {
	#foo = () => {
		return 1;
	};
}
`,
			snapshot: `
class A {
	#foo = () => {
	~~~~
	Class field function does not use \`this\` and could be made static.
		return 1;
	};
}
`,
		},
	],
	valid: [
		// Uses this.value
		`
class A {
	value = 1;
	foo() {
		return this.value;
	}
}
`,
		// Already static
		`
class A {
	static foo() {
		return 1;
	}
}
`,
		// Constructor (not a MethodDeclaration visitor)
		`
class A {
	constructor() {
		this.value = 1;
	}
}
`,
		// Abstract method
		`
abstract class A {
	abstract foo(): void;
}
`,
		// Override method
		`
class Child extends Parent {
	override foo() {
		return 2;
	}
}
`,
		// Uses super
		`
class Child extends Parent {
	foo() {
		return super.foo() + 1;
	}
}
`,
		// Uses this directly
		`
class A {
	foo() {
		return this;
	}
}
`,
		// Uses this in variable
		`
class A {
	bar() {
		const self = this;
		return self;
	}
}
`,
		// Arrow function captures this from method
		`
class A {
	foo() {
		const fn = () => this.value;
		return fn();
	}
}
`,
		// Getter uses this
		`
class A {
	value = 1;
	get computed() {
		return this.value * 2;
	}
}
`,
		// Setter uses this
		`
class A {
	_value = 1;
	set value(v: number) {
		this._value = v;
	}
}
`,
		// Class field arrow function uses this
		`
class A {
	value = 1;
	foo = () => {
		return this.value;
	};
}
`,
		// Static class field (not checked)
		`
class A {
	static foo = () => {
		return 1;
	};
}
`,
		// Class field non-function (not checked)
		`
class A {
	foo = 1;
}
`,
		// Static getter
		`
class A {
	static get value() {
		return 1;
	}
}
`,
		// Static setter
		`
class A {
	static set value(v: number) {
		console.log(v);
	}
}
`,
		// enforceForClassFields: false
		{
			code: `
class A {
	foo = () => {
		return 1;
	};
}
`,
			options: { enforceForClassFields: false },
		},
		// exceptMethods matches
		{
			code: `
class A {
	foo() {
		return 1;
	}
}
`,
			options: { exceptMethods: ["foo"] },
		},
		// exceptMethods matches private method
		{
			code: `
class A {
	#privateMethod() {
		return 1;
	}
}
`,
			options: { exceptMethods: ["#privateMethod"] },
		},
		// ignoreClassesThatImplementAnInterface: "all"
		{
			code: `
interface I {}
class A implements I {
	foo() {
		return 1;
	}
}
`,
			options: { ignoreClassesThatImplementAnInterface: "all" },
		},
		// ignoreClassesThatImplementAnInterface: "public-fields"
		{
			code: `
interface I {}
class A implements I {
	foo() {
		return 1;
	}
}
`,
			options: { ignoreClassesThatImplementAnInterface: "public-fields" },
		},
		// Class that doesn't implement interface but uses this
		`
class A {
	value = 1;
	foo() {
		return this.value;
	}
}
`,
	],
});
