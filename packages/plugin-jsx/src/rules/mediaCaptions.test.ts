import rule from "./mediaCaptions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<audio src="audio.mp3" />`,
			fileName: "file.tsx",
			snapshot: `<audio src="audio.mp3" />
~~~~~
Media elements must have captions via a <track> element.
`,
		},
		{
			code: `<video src="video.mp4" />`,
			fileName: "file.tsx",
			snapshot: `<video src="video.mp4" />
~~~~~
Media elements must have captions via a <track> element.
`,
		},
		{
			code: `<audio><source src="audio.mp3" /></audio>`,
			fileName: "file.tsx",
			snapshot: `<audio><source src="audio.mp3" /></audio>
~~~~~
Media elements must have captions via a <track> element.
`,
		},
		{
			code: `<video><track kind="subtitles" /></video>`,
			fileName: "file.tsx",
			snapshot: `<video><track kind="subtitles" /></video>
~~~~~
Media elements must have captions via a <track> element.
`,
		},
	],
	valid: [
		{ code: `<audio><track kind="captions" /></audio>`, fileName: "file.tsx" },
		{ code: `<video><track kind="captions" /></video>`, fileName: "file.tsx" },
		{ code: `<video muted />`, fileName: "file.tsx" },
		{ code: `<div>Not media</div>`, fileName: "file.tsx" },
		{ code: `<audio muted src="audio.mp3" />`, fileName: "file.tsx" },
	],
});
