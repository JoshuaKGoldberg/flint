import path from "node:path";
import { createFSBackedLinterHost, createVFSLinterHost } from "@flint.fyi/core";

export interface RuleTesterTSHostOptions {
	defaultCompilerOptions?: Record<string, unknown>;
}

export function createRuleTesterTSHost(
	dirname: string,
	opts: RuleTesterTSHostOptions = {},
) {
	const fsHost = createFSBackedLinterHost(dirname);
	const overlay = createVFSLinterHost(dirname, {
		...fsHost,
		stat(pathAbsolute) {
			if (pathAbsolute.endsWith("tsconfig.json")) {
				return undefined;
			}
			return fsHost.stat(pathAbsolute);
		},
	});
	overlay.vfsUpsertFile(
		path.join(dirname, "tsconfig.base.json"),
		JSON.stringify(
			{
				compilerOptions: {
					strict: true,
					lib: ["esnext"],
					target: "esnext",
					types: [],
					moduleResolution: "bundler",
					...opts.defaultCompilerOptions,
				},
			},
			null,
			2,
		),
	);
	overlay.vfsUpsertFile(
		path.join(dirname, "tsconfig.json"),
		JSON.stringify(
			{
				extends: "./tsconfig.base.json",
			},
			null,
			2,
		),
	);
	return overlay;
}
