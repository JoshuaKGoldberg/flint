import { ruleTester } from "./ruleTester.js";
import rule from "./unsafeFinallyStatements.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
try {
    doSomething();
} finally {
    return 1;
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    return 1;
    ~~~~~~
    This control flow statement can override any returned value from try/catch blocks.
}
`,
		},
		{
			code: `
try {
    doSomething();
} catch (error) {
    console.error(error);
} finally {
    return;
}
`,
			snapshot: `
try {
    doSomething();
} catch (error) {
    console.error(error);
} finally {
    return;
    ~~~~~~
    This control flow statement can override any returned value from try/catch blocks.
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    throw new Error("Error");
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    throw new Error("Error");
    ~~~~~
    This control flow statement can override any returned value from try/catch blocks.
}
`,
		},
		{
			code: `
while (condition) {
    try {
        doSomething();
    } finally {
        break;
    }
}
`,
			snapshot: `
while (condition) {
    try {
        doSomething();
    } finally {
        break;
        ~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
for (let i = 0; i < 10; i++) {
    try {
        doSomething();
    } finally {
        continue;
    }
}
`,
			snapshot: `
for (let i = 0; i < 10; i++) {
    try {
        doSomething();
    } finally {
        continue;
        ~~~~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
function test() {
    try {
        doSomething();
        return "success";
    } finally {
        return "override";
    }
}
`,
			snapshot: `
function test() {
    try {
        doSomething();
        return "success";
    } finally {
        return "override";
        ~~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    if (condition) {
        return;
    }
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    if (condition) {
        return;
        ~~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    while (condition) {
        break;
    }
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    while (condition) {
        break;
        ~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    for (let i = 0; i < 10; i++) {
        continue;
    }
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    for (let i = 0; i < 10; i++) {
        continue;
        ~~~~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    switch (value) {
        case 1:
            return;
    }
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    switch (value) {
        case 1:
            return;
            ~~~~~~
            This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
		{
			code: `
try {
    doSomething();
} finally {
    label: {
        break label;
    }
}
`,
			snapshot: `
try {
    doSomething();
} finally {
    label: {
        break label;
        ~~~~~
        This control flow statement can override any returned value from try/catch blocks.
    }
}
`,
		},
	],
	valid: [
		`try { doSomething(); } finally { cleanup(); }`,
		`try { doSomething(); } catch (error) { console.error(error); } finally { cleanup(); }`,
		`try { return 1; } finally { cleanup(); }`,
		`try { throw new Error("Error"); } finally { cleanup(); }`,
		`
try {
    doSomething();
} finally {
    console.log("cleanup");
}
`,
		`
function test() {
    try {
        return doSomething();
    } finally {
        cleanup();
    }
}
`,
		`
while (condition) {
    try {
        break;
    } finally {
        cleanup();
    }
}
`,
		`
for (let i = 0; i < 10; i++) {
    try {
        continue;
    } finally {
        cleanup();
    }
}
`,
		`
try {
    doSomething();
} finally {
    if (condition) {
        cleanup();
    }
}
`,
		`
try {
    doSomething();
} finally {
    for (let i = 0; i < 10; i++) {
        cleanup();
    }
}
`,
		`
try {
    doSomething();
} finally {
    while (condition) {
        cleanup();
    }
}
`,
	],
});
