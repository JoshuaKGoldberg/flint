import { base } from "../base.js";
import { formatIgnoreFile } from "./files/formatIgnoreFile.js";
import { z } from "zod";

//#region src/blocks/blockGitignore.ts
const blockGitignore = base.createBlock({
	about: { name: "Gitignore" },
	addons: { ignores: z.array(z.string()).default([]) },
	produce({ addons }) {
		const { ignores } = addons;
		return { files: { ".gitignore": formatIgnoreFile(["/node_modules", ...ignores].sort()) } };
	}
});

//#endregion
export { blockGitignore };
//# sourceMappingURL=blockGitignore.js.map