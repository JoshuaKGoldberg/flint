import rule from "./classMethodsThis.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
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
	],
	valid: [
		`
class A {
	value = 1;
	foo() {
		return this.value;
	}
}
`,
		`
class A {
	static foo() {
		return 1;
	}
}
`,
		`
class A {
	constructor() {
		this.value = 1;
	}
}
`,
		`
class A {
	get value() {
		return 1;
	}
}
`,
		`
class A {
	set value(v: number) {
		console.log(v);
	}
}
`,
		`
abstract class A {
	abstract foo(): void;
}
`,
		`
class Child extends Parent {
	override foo() {
		return 2;
	}
}
`,
		`
class Child extends Parent {
	foo() {
		return super.foo() + 1;
	}
}
`,
		`
class A {
	foo() {
		return this;
	}
}
`,
		`
class A {
	bar() {
		const self = this;
		return self;
	}
}
`,
		`
class A {
	foo() {
		const fn = () => this.value;
		return fn();
	}
}
`,
	],
});
