import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import * as fs from "node:fs";
import * as path from "node:path";

interface PackageJson {
	bin?: Record<string, string> | string;
}

function findPackageJson(startDir: string): string | undefined {
	let currentDir = startDir;
	const root = path.parse(currentDir).root;

	while (currentDir !== root) {
		const packageJsonPath = path.join(currentDir, "package.json");
		if (fs.existsSync(packageJsonPath)) {
			return packageJsonPath;
		}
		currentDir = path.dirname(currentDir);
	}

	return undefined;
}

function isExecutableFile(filePath: string, packageJsonPath: string): boolean {
	try {
		const packageJson = JSON.parse(
			fs.readFileSync(packageJsonPath, "utf8"),
		) as PackageJson;

		if (!packageJson.bin) {
			return false;
		}

		const packageDir = path.dirname(packageJsonPath);
		const relativeFilePath = path.relative(packageDir, filePath);

		if (typeof packageJson.bin === "string") {
			const binPath = path.normalize(packageJson.bin);
			return path.normalize(relativeFilePath) === binPath;
		}

		const binPaths = Object.values(packageJson.bin).map((binPath) =>
			path.normalize(binPath),
		);
		return binPaths.some(
			(binPath) => path.normalize(relativeFilePath) === binPath,
		);
	} catch {
		return false;
	}
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Require or disallow hashbangs in files based on their executable status.",
		id: "hashbangs",
		preset: "logical",
	},
	messages: {
		missingHashbang: {
			primary:
				"Files listed in package.json's bin field require a hashbang to execute properly.",
			secondary: [
				"Unix-like systems use the hashbang (#!) line to determine which interpreter should execute the file.",
				"Add `#!/usr/bin/env node` at the start of the file to enable direct execution.",
			],
			suggestions: ["Add `#!/usr/bin/env node` at the beginning of the file"],
		},
		unexpectedHashbang: {
			primary:
				"Hashbangs are only needed for files listed in package.json's bin field.",
			secondary: [
				"The hashbang (#!) line tells Unix-like systems which interpreter to use when executing a file directly.",
				"Regular source files imported as modules should not include hashbangs.",
			],
			suggestions: ["Remove the hashbang from the beginning of the file"],
		},
		unicodeBom: {
			primary:
				"The Unicode BOM can interfere with hashbang interpretation on Unix-like systems.",
			secondary: [
				"The Byte Order Mark (BOM) is an invisible character (U+FEFF) that some editors add to indicate file encoding.",
				"When present before a hashbang, it prevents Unix-like systems from recognizing the interpreter directive.",
			],
			suggestions: ["Remove the Unicode BOM from the file"],
		},
		windowsLinebreaks: {
			primary:
				"The hashbang line requires Unix line breaks (LF) to work correctly on Unix-like systems.",
			secondary: [
				"Windows line breaks (CRLF) include an extra carriage return character that Unix-like systems don't recognize.",
				"This can cause the hashbang to fail or include unwanted characters in the interpreter path.",
			],
			suggestions: ["Convert the hashbang line to Unix format (LF)"],
		},
	},
	setup(context) {
		return {
			visitors: {
				SourceFile(sourceFile) {
					const packageJsonPath = findPackageJson(
						path.dirname(sourceFile.fileName),
					);

					if (!packageJsonPath) {
						return;
					}

					const isExecutable = isExecutableFile(
						sourceFile.fileName,
						packageJsonPath,
					);
					const text = sourceFile.text;
					const hasHashbang = text.startsWith("#!");

					if (isExecutable) {
						if (text.charCodeAt(0) === 0xfeff) {
							context.report({
								message: "unicodeBom",
								range: getTSNodeRange(sourceFile, sourceFile),
							});
							return;
						}

						if (!hasHashbang) {
							context.report({
								message: "missingHashbang",
								range: getTSNodeRange(sourceFile.statements[0], sourceFile),
							});
							return;
						}

						const firstLineEnd = text.indexOf("\n");
						const hashbangLine =
							firstLineEnd === -1 ? text : text.substring(0, firstLineEnd);

						if (hashbangLine.includes("\r")) {
							context.report({
								message: "windowsLinebreaks",
								range: { begin: 0, end: hashbangLine.length },
							});
						}
					} else if (hasHashbang) {
						const hashbangEnd = text.indexOf("\n");
						const hashbangLength =
							hashbangEnd === -1 ? text.length : hashbangEnd + 1;

						context.report({
							message: "unexpectedHashbang",
							range: { begin: 0, end: hashbangLength },
						});
					}
				},
			},
		};
	},
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
