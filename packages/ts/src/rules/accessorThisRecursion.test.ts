import rule from "./accessorThisRecursion.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = {
    get name() {
        return this.name;
    }
};
`,
			snapshot: `
const value = {
    get name() {
        return this.name;
               ~~~~~~~~~
               Getting \`this\` property within its own getter causes infinite recursion.
    }
};
`,
		},
		{
			code: `
const value = {
    set name(input) {
        this.name = input;
    }
};
`,
			snapshot: `
const value = {
    set name(input) {
        this.name = input;
        ~~~~~~~~~
        Setting \`this\` property within its own setter causes infinite recursion.
    }
};
`,
		},
		{
			code: `
class Example {
    get name() {
        return this.name;
    }
}
`,
			snapshot: `
class Example {
    get name() {
        return this.name;
               ~~~~~~~~~
               Getting \`this\` property within its own getter causes infinite recursion.
    }
}
`,
		},
		{
			code: `
class Example {
    set name(input) {
        this.name = input;
    }
}
`,
			snapshot: `
class Example {
    set name(input) {
        this.name = input;
        ~~~~~~~~~
        Setting \`this\` property within its own setter causes infinite recursion.
    }
}
`,
		},
		{
			code: `
const value = {
    get name() {
        if (condition) {
            return this.name;
        }
        return "";
    }
};
`,
			snapshot: `
const value = {
    get name() {
        if (condition) {
            return this.name;
                   ~~~~~~~~~
                   Getting \`this\` property within its own getter causes infinite recursion.
        }
        return "";
    }
};
`,
		},
		{
			code: `
const value = {
    get "computed"() {
        return this.computed;
    }
};
`,
			snapshot: `
const value = {
    get "computed"() {
        return this.computed;
               ~~~~~~~~~~~~~
               Getting \`this\` property within its own getter causes infinite recursion.
    }
};
`,
		},
	],
	valid: [
		`const value = { get name() { return this.other; } };`,
		`const value = { set name(input) { this.other = input; } };`,
		`const value = { get name() { return this._name; } };`,
		`const value = { set name(input) { this._name = input; } };`,
		`class Example { get name() { return this._name; } }`,
		`class Example { set name(input) { this._name = input; } }`,
		`const value = { set name(input) { console.log(this.name); } };`,
		`const value = { get [computed]() { return this.computed; } };`,
	],
});
