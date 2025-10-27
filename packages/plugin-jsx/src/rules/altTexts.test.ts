import rule from "./altTexts.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<img src="foo.jpg" />`,
			fileName: "file.tsx",
			snapshot: `<img src="foo.jpg" />
 ~~~
 img element is missing alt text for non-visual users.`,
		},
		{
			code: `<img src="foo.jpg" alt />`,
			fileName: "file.tsx",
			snapshot: `<img src="foo.jpg" alt />
 ~~~
 img element is missing alt text for non-visual users.`,
		},
		{
			code: `<img src="foo.jpg" alt={undefined} />`,
			fileName: "file.tsx",
			snapshot: `<img src="foo.jpg" alt={undefined} />
 ~~~
 img element is missing alt text for non-visual users.`,
		},
		{
			code: `<area href="#" />`,
			fileName: "file.tsx",
			snapshot: `<area href="#" />
 ~~~~
 area element is missing alt text for non-visual users.`,
		},
		{
			code: `<input type="image" src="submit.png" />`,
			fileName: "file.tsx",
			snapshot: `<input type="image" src="submit.png" />
 ~~~~~
 input[type='image'] element is missing alt text for non-visual users.`,
		},
		{
			code: `<object data="movie.mp4" />`,
			fileName: "file.tsx",
			snapshot: `<object data="movie.mp4" />
 ~~~~~~
 object element is missing alt text for non-visual users.`,
		},
	],
	valid: [
		{ code: `<img src="foo.jpg" alt="A foo" />`, fileName: "file.tsx" },
		{ code: `<img src="foo.jpg" alt="" />`, fileName: "file.tsx" },
		{ code: `<img src="foo.jpg" alt={altTexts} />`, fileName: "file.tsx" },
		{ code: `<img src="foo.jpg" aria-label="Foo" />`, fileName: "file.tsx" },
		{ code: `<area alt="Click here" href="#" />`, fileName: "file.tsx" },
		{ code: `<input type="image" alt="Submit" />`, fileName: "file.tsx" },
		{ code: `<input type="text" />`, fileName: "file.tsx" },
		{ code: `<object aria-label="Video" />`, fileName: "file.tsx" },
		{ code: `<object title="Movie" />`, fileName: "file.tsx" },
		{ code: `<div>Not an image element</div>`, fileName: "file.tsx" },
	],
});
