import rule from "./caseDeclarations.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
switch (value) {
    case 1:
        let x = 1;
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        let x = 1;
        ~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    case 1:
        const x = 1;
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        const x = 1;
        ~~~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    case 1:
        function foo() {}
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        function foo() {}
        ~~~~~~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    case 1:
        class Foo {}
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        class Foo {}
        ~~~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    default:
        let x = 1;
        break;
}
`,
			snapshot: `
switch (value) {
    default:
        let x = 1;
        ~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    default:
        const x = 1;
        break;
}
`,
			snapshot: `
switch (value) {
    default:
        const x = 1;
        ~~~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    case 1:
        let x = 1;
    case 2:
        let y = 2;
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        let x = 1;
        ~~~
        Lexical declarations in case clauses should be wrapped in blocks.
    case 2:
        let y = 2;
        ~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        break;
}
`,
		},
		{
			code: `
switch (value) {
    case 1:
        const x = 1;
        console.log(x);
        break;
}
`,
			snapshot: `
switch (value) {
    case 1:
        const x = 1;
        ~~~~~
        Lexical declarations in case clauses should be wrapped in blocks.
        console.log(x);
        break;
}
`,
		},
	],
	valid: [
		`switch (value) { case 1: { let x = 1; break; } }`,
		`switch (value) { case 1: { const x = 1; break; } }`,
		`switch (value) { case 1: { function foo() {} break; } }`,
		`switch (value) { case 1: { class Foo {} break; } }`,
		`switch (value) { default: { let x = 1; break; } }`,
		`switch (value) { default: { const x = 1; break; } }`,
		`switch (value) { case 1: var x = 1; break; }`,
		`switch (value) { case 1: break; }`,
		`switch (value) { case 1: console.log("test"); break; }`,
		`
switch (value) {
    case 1: {
        let x = 1;
        break;
    }
}
`,
		`
switch (value) {
    case 1: {
        const x = 1;
        break;
    }
}
`,
		`
switch (value) {
    case 1: {
        function foo() {}
        break;
    }
}
`,
		`
switch (value) {
    case 1: {
        class Foo {}
        break;
    }
}
`,
		`
switch (value) {
    case 1:
        var x = 1;
        break;
}
`,
		`
switch (value) {
    case 1: {
        let x = 1;
    }
    case 2: {
        let y = 2;
        break;
    }
}
`,
		`
switch (value) {
    default: {
        let x = 1;
        break;
    }
}
`,
	],
});
