"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRichReport = createRichReport;
// TODO: styleText
var chalk_1 = require("chalk");
function createRichReport(report) {
	return [
		chalk_1.default.hex("ff7777")("./"),
		chalk_1.default.bold.hex("ff4949")("src/base.ts"),
		"                                                                                ",
		"    ",
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")("D"),
		chalk_1.default.hex("888888")("]"),
		chalk_1.default.gray("etails: enabled"),
		"    ",
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")("F"),
		chalk_1.default.hex("888888")("]"),
		chalk_1.default.gray("ocused view: enabled"),
		"\n\n",
		chalk_1.default.hex("ccaaaa")("["),
		chalk_1.default
			.hex("ff9999")
			.bold("\u001B]8;;http://example.com\u0007awaitThenables\u001B]8;;\u0007"),
		chalk_1.default.hex("ccaaaa")("]"),
		" ",
		chalk_1.default.hex("#eeaa77")(
			'A non-Promise (non-"Thenable") value is being awaited.',
		),
		"\n\n",
		chalk_1.default.hex("bbb")("  50:1 "),
		chalk_1.default.gray("│ "),
		chalk_1.default.hex("#dcf")("await "),
		chalk_1.default.hex("#cdf")("process"),
		chalk_1.default.hex("#cdd")("()"),
		chalk_1.default.hex("#aaa")(";"),
		"\n",
		chalk_1.default.gray("       │ "),
		chalk_1.default.hex("#fcc")("~~~~~~~~~~~~~~~"),
		"\n\n",
		chalk_1.default.hex("bbeeff")("Suggestions:"),
		"\n",
		chalk_1.default.hex("99aacc")(" • "),
		chalk_1.default.hex("bbccdd")("If the `"),
		chalk_1.default.hex("bbeeff")("process"),
		chalk_1.default.hex("bbccdd")(
			"` function doesn't need to be asynchronous, remove the `",
		),
		chalk_1.default.hex("bbeeff")("await"),
		chalk_1.default.hex("bbccdd")("`."),
		"\n",
		chalk_1.default.hex("99aacc")(" • "),
		chalk_1.default.hex("bbccdd")(
			"Otherwise, ensure it returns a Promise, such as declaring it as `",
		),
		chalk_1.default.hex("bbeeff")("async"),
		chalk_1.default.hex("bbccdd")("`."),
		"\n\n",
		chalk_1.default
			.hex("ccbbaa")
			.italic(
				'A "Thenable" is an object with a `then` method, such as a Promise. ',
			),
		chalk_1.default
			.hex("ccbbaa")
			.italic(
				"Using `await` on a non-Thenable value just returns the value after a tick.",
			),
		"\n",
		chalk_1.default.hex("ddccbb").italic("→ "),
		chalk_1.default
			.hex("aaccaa")
			.italic(
				"\u001B]8;;https://example.com/awaitThenables\u0007example.com/awaitThenables\u001B]8;;\u0007",
			),
		"\n\n",
		chalk_1.default.hex("ff5656")("✖ Found "),
		chalk_1.default.hex("ff4949").bold("7"),
		chalk_1.default.hex("ff5656")(" reports across "),
		chalk_1.default.hex("ff4949").bold("3"),
		chalk_1.default.hex("ff5656")(" files"),
		"                                                                  ",
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")("v"),
		chalk_1.default.hex("888888")("]"),
		chalk_1.default.gray(" Report 2 of 3 "),
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")("^"),
		chalk_1.default.hex("888888")("]"),
		"    ",
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")("<"),
		chalk_1.default.hex("888888")("]"),
		chalk_1.default.gray(" File 2 of 3 "),
		chalk_1.default.hex("888888")("["),
		chalk_1.default.hex("999999")(">"),
		chalk_1.default.hex("888888")("]"),
		"\n",
	];
}
