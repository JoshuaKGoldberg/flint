// Adapted from: https://github.com/ArnaudBarre/tsl/blob/742a6f1a956705239f2149f856b1f572ade79919/src/formatDiagnostic.ts
// ...which notes:
// Adapted from: https://github.com/microsoft/TypeScript/blob/78c16795cdee70b9d9f0f248b6dbb6ba50994a59/src/compiler/program.ts#L680-L811

// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { LanguageFileDiagnostic } from "@flint.fyi/core";
import ts, {
	flattenDiagnosticMessageText,
	getLineAndCharacterOfPosition,
	getPositionOfLineAndCharacter,
	type SourceFile,
} from "typescript";

interface RawDiagnostic {
	file?: ts.SourceFile;
	length: number;
	message: string;
	name: string;
	relatedInformation?: ts.DiagnosticRelatedInformation[];
	start: number;
}

export function convertTypeScriptDiagnosticToLanguageFileDiagnostic(
	diagnostic: ts.Diagnostic,
): LanguageFileDiagnostic {
	return {
		code: `TS${diagnostic.code}`,
		text: formatDiagnostic({
			...diagnostic,
			length: diagnostic.length!,
			message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
			name: `TS${diagnostic.code}`,
			start: diagnostic.start!,
		}),
	};
}

function color(text: string, formatStyle: string) {
	return formatStyle + text + resetEscapeSequence;
}

function formatDiagnostic(diagnostic: RawDiagnostic) {
	let output = "";

	if (diagnostic.file !== undefined) {
		output += formatLocation(diagnostic.file, diagnostic.start);
		output += " - ";
	}
	output += color(diagnostic.name, COLOR.Grey);
	output += ": ";
	output += diagnostic.message;
	if (diagnostic.file !== undefined) {
		output += "\n";
		output += formatCodeSpan(
			diagnostic.file,
			diagnostic.start,
			diagnostic.length,
			"",
			COLOR.Red,
		);
	}
	if (diagnostic.relatedInformation) {
		output += "\n";
		for (const {
			file,
			length,
			messageText,
			start,
		} of diagnostic.relatedInformation) {
			const indent = "  ";
			if (file) {
				output += "\n";
				output += " " + formatLocation(file, start!);
				output += formatCodeSpan(file, start!, length!, indent, COLOR.Cyan);
			}
			output += "\n";
			output += indent + flattenDiagnosticMessageText(messageText, "\n");
		}
	}

	return output;
}

const gutterStyleSequence = "\u001b[7m";
const ellipsis = "...";
const gutterSeparator = " ";
const resetEscapeSequence = "\u001b[0m";
const COLOR = {
	Blue: "\u001b[94m",
	Cyan: "\u001b[96m",
	Grey: "\u001b[90m",
	Red: "\u001b[91m",
	Yellow: "\u001b[93m",
};

function displayFilename(name: string) {
	if (name.startsWith("./")) {
		return name.slice(2);
	}
	return name.slice(process.cwd().length + 1);
}

function formatCodeSpan(
	file: SourceFile,
	start: number,
	length: number,
	indent: string,
	squiggleColor: string,
) {
	const { character: firstLineChar, line: firstLine } =
		getLineAndCharacterOfPosition(file, start);
	const { character: lastLineChar, line: lastLine } =
		getLineAndCharacterOfPosition(file, start + length);
	const lastLineInFile = getLineAndCharacterOfPosition(
		file,
		file.text.length,
	).line;
	const hasMoreThanFiveLines = lastLine - firstLine >= 4;
	// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	let gutterWidth = (lastLine + 1 + "").length;
	if (hasMoreThanFiveLines) {
		gutterWidth = Math.max(ellipsis.length, gutterWidth);
	}
	let context = "";
	for (let i = firstLine; i <= lastLine; i++) {
		context += "\n";
		if (hasMoreThanFiveLines && firstLine + 1 < i && i < lastLine - 1) {
			context +=
				indent +
				color(ellipsis.padStart(gutterWidth), gutterStyleSequence) +
				gutterSeparator +
				"\n";
			i = lastLine - 1;
		}
		const lineStart = getPositionOfLineAndCharacter(file, i, 0);
		const lineEnd =
			i < lastLineInFile
				? getPositionOfLineAndCharacter(file, i + 1, 0)
				: file.text.length;
		let lineContent = file.text.slice(lineStart, lineEnd);
		lineContent = lineContent.trimEnd();
		lineContent = lineContent.replace(/\t/g, " ");
		context +=
			indent +
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			color((i + 1 + "").padStart(gutterWidth), gutterStyleSequence) +
			gutterSeparator;
		context += lineContent + "\n";
		context +=
			indent +
			color("".padStart(gutterWidth), gutterStyleSequence) +
			gutterSeparator;
		context += squiggleColor;
		if (i === firstLine) {
			const lastCharForLine = i === lastLine ? lastLineChar : undefined;
			context += lineContent.slice(0, firstLineChar).replace(/\S/g, " ");
			context += lineContent
				.slice(firstLineChar, lastCharForLine)
				.replace(/./g, "~");
		} else if (i === lastLine) {
			context += lineContent.slice(0, lastLineChar).replace(/./g, "~");
		} else {
			context += lineContent.replace(/./g, "~");
		}
		context += resetEscapeSequence;
	}
	return context;
}

function formatLocation(file: SourceFile, start: number): string {
	const { character, line } = getLineAndCharacterOfPosition(file, start);
	const relativeFileName = displayFilename(file.fileName);
	let output = "";
	output += color(relativeFileName, COLOR.Cyan);
	output += ":";
	output += color(`${line + 1}`, COLOR.Yellow);
	output += ":";
	output += color(`${character + 1}`, COLOR.Yellow);
	return output;
}
