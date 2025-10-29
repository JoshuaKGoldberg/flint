import { typescriptLanguage } from "@flint.fyi/ts";
import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

interface PackageJson {
	bin?: Record<string, string> | string;
	files?: string[];
}

function checkIgnoreFile(relativePath: string, ignorePath: string): boolean {
	const content = fs.readFileSync(ignorePath, "utf8");
	const lines = content.split("\n");
	const normalizedPath = relativePath.replace(/\\/g, "/");

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const pattern = trimmed.replace(/\\/g, "/");

		if (pattern === normalizedPath) {
			return true;
		}

		if (pattern.endsWith("/")) {
			if (normalizedPath.startsWith(pattern)) {
				return true;
			}
		} else if (normalizedPath.startsWith(pattern + "/")) {
			return true;
		}

		if (pattern.includes("*")) {
			const regexPattern = pattern
				.replace(/\./g, "\\.")
				.replace(/\*/g, ".*")
				.replace(/\?/g, ".");
			const regex = new RegExp(`^${regexPattern}$`);
			if (regex.test(normalizedPath)) {
				return true;
			}
		}
	}

	return false;
}

function findPackageJson(startPath: string): string | undefined {
	let currentPath = startPath;

	while (true) {
		const packageJsonPath = path.join(currentPath, "package.json");
		if (fs.existsSync(packageJsonPath)) {
			return packageJsonPath;
		}

		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) {
			return undefined;
		}
		currentPath = parentPath;
	}
}

function isBinFile(
	filePath: string,
	bin: PackageJson["bin"],
	basedir: string,
): boolean {
	if (!bin) {
		return false;
	}

	if (typeof bin === "string") {
		return path.resolve(basedir, bin) === filePath;
	}

	return Object.values(bin).some(
		(binPath) => path.resolve(basedir, binPath) === filePath,
	);
}

function isIgnoredByFiles(
	relativePath: string,
	files: string[] | undefined,
): boolean {
	if (!files || files.length === 0) {
		return false;
	}

	const normalizedPath = relativePath.replace(/\\/g, "/");

	for (const pattern of files) {
		const normalizedPattern = pattern.replace(/\\/g, "/");
		if (normalizedPath === normalizedPattern) {
			return false;
		}
		if (normalizedPattern.endsWith("/")) {
			if (normalizedPath.startsWith(normalizedPattern)) {
				return false;
			}
		}
		if (normalizedPath.startsWith(normalizedPattern + "/")) {
			return false;
		}
	}

	return true;
}

function isIgnoredByNpmignore(relativePath: string, basedir: string): boolean {
	const npmignorePath = path.join(basedir, ".npmignore");
	if (!fs.existsSync(npmignorePath)) {
		const gitignorePath = path.join(basedir, ".gitignore");
		if (!fs.existsSync(gitignorePath)) {
			return false;
		}
		return checkIgnoreFile(relativePath, gitignorePath);
	}
	return checkIgnoreFile(relativePath, npmignorePath);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prevent `bin` files from being ignored by npm during package publication.",
		id: "unpublishedBins",
		preset: "logical",
	},
	messages: {
		unpublishedBin: {
			primary:
				"npm ignores '{{name}}'. Ensure it is included in the 'files' field of 'package.json' or not excluded by '.npmignore'.",
			secondary: [
				"npm packages with a `bin` field must ensure those files are published.",
				"Files can be excluded by missing them from the `files` field or by `.npmignore` patterns.",
			],
			suggestions: [
				"Add '{{name}}' to the 'files' field in package.json",
				"Remove '{{name}}' from .npmignore",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				SourceFile(node: ts.SourceFile) {
					const rawFilePath = node.fileName;
					if (rawFilePath === "<input>") {
						return;
					}

					const filePath = path.resolve(rawFilePath);

					const packageJsonPath = findPackageJson(path.dirname(filePath));
					if (!packageJsonPath) {
						return;
					}

					const basedir = path.dirname(packageJsonPath);
					const relativePath = path
						.relative(basedir, filePath)
						.replace(/\\/g, "/");

					let packageJson: PackageJson;
					try {
						packageJson = JSON.parse(
							fs.readFileSync(packageJsonPath, "utf8"),
						) as PackageJson;
					} catch {
						return;
					}

					if (!isBinFile(filePath, packageJson.bin, basedir)) {
						return;
					}

					const ignoredByFiles = isIgnoredByFiles(
						relativePath,
						packageJson.files,
					);
					const ignoredByNpmignore = isIgnoredByNpmignore(
						relativePath,
						basedir,
					);

					if (ignoredByFiles || ignoredByNpmignore) {
						context.report({
							data: {
								name: relativePath,
							},
							message: "unpublishedBin",
							range: { begin: 0, end: 0 },
						});
					}
				},
			},
		};
	},
});
