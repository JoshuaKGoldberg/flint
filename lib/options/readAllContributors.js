import { startingOwnerContributions } from "../data/contributions.js";
import { inputFromOctokit } from "../inputs/inputFromOctokit.js";
import { inputFromFileJSON } from "input-from-file-json";

//#region src/options/readAllContributors.ts
async function readAllContributors(take) {
	const contributions = await take(inputFromFileJSON, { filePath: ".all-contributorsrc" });
	if (!(contributions instanceof Error)) return contributions.contributors;
	const user = await take(inputFromOctokit, { endpoint: "GET /user" });
	return user && [{
		avatar_url: user.avatar_url,
		contributions: startingOwnerContributions,
		login: user.login,
		name: user.name,
		profile: user.blog
	}];
}

//#endregion
export { readAllContributors };
//# sourceMappingURL=readAllContributors.js.map