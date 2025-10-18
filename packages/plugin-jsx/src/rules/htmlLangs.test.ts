import rule from "./htmlLangs.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `const el = <html></html>;`,
			fileName: "file.tsx",
			snapshot: `const el = <html></html>;
           ~~~~
           This <html> element is missing a \`lang\` prop.
`,
		},
		{
			code: `const el = <html className="root"></html>;`,
			fileName: "file.tsx",
			snapshot: `const el = <html className="root"></html>;
           ~~~~
           This <html> element is missing a \`lang\` prop.
`,
		},
		{
			code: `function App() { return <html><body>Content</body></html>; }`,
			fileName: "file.tsx",
			snapshot: `function App() { return <html><body>Content</body></html>; }
                        ~~~~
                        This <html> element is missing a \`lang\` prop.
`,
		},
	],
	valid: [
		{ code: `const el = <html lang="en"></html>;`, fileName: "file.tsx" },
		{ code: `const el = <html lang="en-US"></html>;`, fileName: "file.tsx" },
		{ code: `const el = <html lang={language}></html>;`, fileName: "file.tsx" },
		{
			code: `const el = <html lang="fr" className="root"></html>;`,
			fileName: "file.tsx",
		},
		{ code: `const el = <div></div>;`, fileName: "file.tsx" },
		{ code: `const el = <Html></Html>;`, fileName: "file.tsx" },
		{ code: `const el = <html LANG="en"></html>;`, fileName: "file.tsx" },
	],
});
