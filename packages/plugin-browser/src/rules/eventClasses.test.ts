import rule from "./eventClasses.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
import { EventEmitter } from "events";

class Foo extends EventEmitter {}
`,
			snapshot: `
import { EventEmitter } from "events";

class Foo extends EventEmitter {}
                  ~~~~~~~~~~~~
                  Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
		{
			code: `
import { EventEmitter } from "node:events";

class Bar extends EventEmitter {}
`,
			snapshot: `
import { EventEmitter } from "node:events";

class Bar extends EventEmitter {}
                  ~~~~~~~~~~~~
                  Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
		{
			code: `
import { EventEmitter } from "events";

const emitter = new EventEmitter();
`,
			snapshot: `
import { EventEmitter } from "events";

const emitter = new EventEmitter();
                    ~~~~~~~~~~~~
                    Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
		{
			code: `
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();
`,
			snapshot: `
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();
                    ~~~~~~~~~~~~
                    Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
		{
			code: `
import { EventEmitter as EE } from "events";

class MyClass extends EE {}
`,
			snapshot: `
import { EventEmitter as EE } from "events";

class MyClass extends EE {}
                      ~~
                      Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
		{
			code: `
import { EventEmitter as EE } from "events";

const instance = new EE();
`,
			snapshot: `
import { EventEmitter as EE } from "events";

const instance = new EE();
                     ~~
                     Prefer \`EventTarget\` over \`EventEmitter\`.
`,
		},
	],
	valid: [
		`class Foo extends EventTarget {}`,
		`const target = new EventTarget();`,
		`
			import { EventEmitter } from "./custom-emitter";
			class Foo extends EventEmitter {}
		`,
		`
			import { EventEmitter } from "./custom-emitter";
			const emitter = new EventEmitter();
		`,
		`
			class EventEmitter {}
			class Foo extends EventEmitter {}
		`,
		`
			class EventEmitter {}
			const instance = new EventEmitter();
		`,
		`
			import { EventTarget } from "events";
			class Foo extends EventTarget {}
		`,
	],
});
