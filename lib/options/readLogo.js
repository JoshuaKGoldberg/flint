import { readLogoSizing } from "./readLogoSizing.js";
import * as fs from "node:fs/promises";

//#region src/options/readLogo.ts
async function readLogo(getReadme) {
	const tag = /\n<img.+src=.+>/.exec(await getReadme())?.[0];
	if (!tag) return;
	const alt = /alt=['"](.+)['"]\s*src=/.exec(tag)?.[1].split(/['"]?\s*\w+=/)[0] ?? "Project logo";
	if (/All Contributors: \d+/.test(alt)) return;
	const src = /src\s*=(.+)['"/]>/.exec(tag)?.[1]?.split(/\s*\w+=/)[0].replaceAll(/^['"]|['"]$/g, "");
	if (!src || src.includes("//img.shields.io")) return;
	return {
		alt,
		src,
		...readLogoSizing(await fs.readFile(src))
	};
}

//#endregion
export { readLogo };
//# sourceMappingURL=readLogo.js.map