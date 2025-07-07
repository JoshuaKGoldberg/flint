import { createRichReport } from "./createRichReport.js";

for (const i in ["a", "b", "c"]) {
	//
}

console.log(
	await createRichReport(
		{
			about: {
				id: "awaitThenables",
			},
			message: {
				primary: `A non-Promise (non-"Thenable") value is being awaited.`,
				secondary: [
					'A "Thenable" is an object with a `then` method, such as a Promise. Using `await` on a non-Thenable value just returns the value after a tick.',
				],
				suggestions: [
					`If the \`process\` function doesn't need to be asynchronous, remove the \`await\`.`,
					`Otherwise, ensure it returns a Promise, such as declaring it as \`async\`.`,
				],
			},
			range: {
				begin: {
					column: 1,
					line: 2,
					raw: 3,
				},
				end: {
					column: 4,
					line: 5,
					raw: 6,
				},
			},
		},
		`console.log("Hello, world!");`,
	),
);
