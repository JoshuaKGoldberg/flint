import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import fs from "node:fs";
import path from "node:path";

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
			primary: "Executable files must start with a hashbang.",
			secondary: [
				"Files listed in package.json's bin field should have `#!/usr/bin/env node` at the start.",
			],
			suggestions: ["Add `#!/usr/bin/env node` at the beginning of the file."],
		},
		unexpectedHashbang: {
			primary: "Non-executable files must not have a hashbang.",
			secondary: [
				"Only files listed in package.json's bin field should have hashbangs.",
			],
			suggestions: ["Remove the hashbang from the beginning of the file."],
		},
		unicodeBom: {
			primary: "Executable files must not have a Unicode BOM.",
			secondary: [
				"The Byte Order Mark (BOM) can cause issues with hashbang interpretation.",
			],
			suggestions: ["Remove the Unicode BOM from the file."],
		},
		windowsLinebreaks: {
			primary: "Executable files must use Unix line breaks (LF).",
			secondary: [
				"Windows line breaks (CRLF) in the hashbang line can cause issues on Unix systems.",
			],
			suggestions: ["Convert line breaks to Unix format (LF)."],
		},
	},
	setup(context) {
		const sourceFile = context.sourceFile;
		const filePath = sourceFile.fileName;
		const fileDir = path.dirname(filePath);
		const packageJsonPath = findPackageJson(fileDir);

		if (!packageJsonPath) {
			return;
		}

		const isExecutable = isExecutableFile(filePath, packageJsonPath);
		const text = sourceFile.text;
		const hasHashbang = text.startsWith("#!");
		const hasBom = text.charCodeAt(0) === 0xfeff;

		if (isExecutable) {
			if (hasBom) {
				context.report({
					message: "unicodeBom",
					range: getTSNodeRange(sourceFile, sourceFile),
				});
				return;
			}

			if (!hasHashbang) {
				const firstStatement = sourceFile.statements[0];
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- first statement may not exist in empty files
				if (firstStatement) {
					context.report({
						message: "missingHashbang",
						range: getTSNodeRange(firstStatement, sourceFile),
					});
				}
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
			const hashbangLength = hashbangEnd === -1 ? text.length : hashbangEnd + 1;

			context.report({
				message: "unexpectedHashbang",
				range: { begin: 0, end: hashbangLength },
			});
		}

		return undefined;
	},
});
