import rule from "./imageAltRedundancy.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<img src="foo.jpg" alt="Photo of foo" />`,
			fileName: "file.tsx",
			snapshot: `<img src="foo.jpg" alt="Photo of foo" />
                   ~~~~~~~~~~~~~~~~~~
                   Alt text should not contain the word 'photo'. Screen readers already announce images as images.`,
		},
		{
			code: `<img src="bar.jpg" alt="Image of bar" />`,
			fileName: "file.tsx",
			snapshot: `<img src="bar.jpg" alt="Image of bar" />
                   ~~~~~~~~~~~~~~~~~~
                   Alt text should not contain the word 'image'. Screen readers already announce images as images.`,
		},
		{
			code: `<img src="baz.jpg" alt="Picture of baz" />`,
			fileName: "file.tsx",
			snapshot: `<img src="baz.jpg" alt="Picture of baz" />
                   ~~~~~~~~~~~~~~~~~~~~
                   Alt text should not contain the word 'picture'. Screen readers already announce images as images.`,
		},
		{
			code: `<img src="test.jpg" alt="A nice PHOTO" />`,
			fileName: "file.tsx",
			snapshot: `<img src="test.jpg" alt="A nice PHOTO" />
                    ~~~~~~~~~~~~~~~~~~
                    Alt text should not contain the word 'photo'. Screen readers already announce images as images.`,
		},
	],
	valid: [
		{
			code: `<img src="foo.jpg" alt="Foo eating a sandwich" />`,
			fileName: "file.tsx",
		},
		{
			code: `<img src="bar.jpg" alt="Bar at the beach" />`,
			fileName: "file.tsx",
		},
		{ code: `<img src="baz.jpg" alt="" />`, fileName: "file.tsx" },
		{
			code: `<img src="pic.jpg" aria-hidden="true" alt="Picture of something" />`,
			fileName: "file.tsx",
		},
		{ code: `<img src="photo.jpg" alt={description} />`, fileName: "file.tsx" },
		{ code: `<div alt="Photo" />`, fileName: "file.tsx" },
	],
});
