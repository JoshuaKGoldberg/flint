import { packageData } from "../data/packageData.js";
import { htmlToTextSafe } from "../utils/htmlToTextSafe.js";
import { readDescriptionFromReadme } from "./readDescriptionFromReadme.js";
import { marked } from "marked";

//#region src/options/readDescription.ts
async function readDescription(getPackageData, getReadme, getRepository) {
	const { description: fromPackageJson } = await getPackageData();
	if (!fromPackageJson) return;
	const fromReadme = await readDescriptionFromReadme(getReadme);
	if (!fromReadme) return marked.parseInline(fromPackageJson);
	if (await getRepository() !== "create-typescript-app" && fromPackageJson === packageData.description) return;
	const fromPackageJsonNormalized = htmlToTextSafe(await marked.parseInline(fromPackageJson));
	if (htmlToTextSafe(fromReadme) !== fromPackageJsonNormalized) return await marked.parseInline(fromPackageJson);
	return fromReadme;
}

//#endregion
export { readDescription };
//# sourceMappingURL=readDescription.js.map