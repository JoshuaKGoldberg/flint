import { createLanguage, LanguagePreparedDefinition } from "@flint.fyi/core";
import * as ts from "typescript";
import path from "node:path";
import assert from "node:assert/strict";

import { TSNodesByName } from "./nodes.js";
import { createProjectService } from "@typescript-eslint/project-service";
import { createTypeScriptServerHost } from "./createTypeScriptServerHost.js";
import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";
import {
	DisposableTypeScriptFile,
	openTypeScriptFileInProjectService,
} from "./openTypeScriptFileInProjectService.js";
import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";

export interface TypeScriptFileServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

let volarPrepareFile:
	| ((
			filePathAbsolute: string,
			tsFile: DisposableTypeScriptFile,
	  ) => LanguagePreparedDefinition)
	| null;
export function setVolarPrepareFile(
	prepare: NonNullable<typeof volarPrepareFile>,
) {
	assert.ok(
		volarPrepareFile == null,
		`setVolarPrepareFile was called twice. Please ensure that you don't have two copies of @flint.fyi/volar-language in you dependency tree.`,
	);
	volarPrepareFile = prepare;
}

function isTypeScriptCoreSupportedExtension(extname: string) {
	switch (extname) {
		case ".ts":
		case ".tsx":
		case ".d.ts":
		case ".js":
		case ".jsx":
		case ".cts":
		case ".d.cts":
		case ".cjs":
		case ".mts":
		case ".d.mts":
		case ".mjs":
			return true;
		default:
			return false;
	}
}

export const typescriptLanguage = createLanguage<
	TSNodesByName,
	TypeScriptFileServices
>({
	about: {
		name: "TypeScript",
	},
	prepare: (host) => {
		const { service } = createProjectService({
			host: createTypeScriptServerHost(host),
		});

		return {
			prepareFile(filePathAbsolute) {
				const tsFile = openTypeScriptFileInProjectService(
					service,
					filePathAbsolute,
				);

				const fileExtension = path.extname(tsFile.sourceFile.fileName);

				if (isTypeScriptCoreSupportedExtension(fileExtension)) {
					return {
						...parseDirectivesFromTypeScriptFile(tsFile.sourceFile),
						file: {
							[Symbol.dispose]: tsFile[Symbol.dispose],
							...createTypeScriptFileFromProgram(
								tsFile.program,
								tsFile.sourceFile,
							),
						},
					};
				}

				if (volarPrepareFile == null) {
					let message = "Unknown extension.";
					switch (fileExtension) {
						case ".astro":
							message = "Did you install @flint.fyi/astro?";
							break;
						case ".mdx":
							message = "Did you install @flint.fyi/mdx?";
							break;
						case ".vue":
							message = "Did you install @flint.fyi/vue?";
							break;
					}

					throw new Error(
						`Cannot process ${tsFile.sourceFile.fileName}. ${message}`,
					);
				}

				return volarPrepareFile(filePathAbsolute, tsFile);
			},
		};
	},
});
