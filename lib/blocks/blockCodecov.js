import { base } from "../base.js";
import { resolveUses } from "./actions/resolveUses.js";
import { intakeFileYamlSteps } from "./actions/steps.js";
import { blockRemoveFiles } from "./blockRemoveFiles.js";
import { blockREADME } from "./blockREADME.js";
import { blockVitest } from "./blockVitest.js";
import { blockGitHubApps } from "./blockGitHubApps.js";
import { z } from "zod";

//#region src/blocks/blockCodecov.ts
const blockCodecov = base.createBlock({
	about: { name: "Codecov" },
	addons: { env: z.record(z.string(), z.string()).optional() },
	intake({ files }) {
		const steps = intakeFileYamlSteps(files, [
			".github",
			"workflows",
			"ci.yaml"
		], [
			"jobs",
			"test",
			"steps"
		]);
		if (!steps) return;
		const step = steps.find((step$1) => typeof step$1.uses === "string" && step$1.uses.startsWith("codecov/codecov-action"));
		if (!step) return;
		return { env: step.env };
	},
	produce({ addons, options }) {
		const { env } = addons;
		return { addons: [
			blockGitHubApps({ apps: [{
				name: "Codecov",
				url: "https://github.com/apps/codecov"
			}] }),
			blockREADME({ badges: [{
				alt: "🧪 Coverage",
				href: `https://codecov.io/gh/${options.owner}/${options.repository}`,
				src: `https://img.shields.io/codecov/c/github/${options.owner}/${options.repository}?label=%F0%9F%A7%AA%20coverage`
			}] }),
			blockVitest({ actionSteps: [{
				...env && { env },
				if: "always()",
				uses: resolveUses("codecov/codecov-action", "v3", options.workflowsVersions)
			}] })
		] };
	},
	transition() {
		return { addons: [blockRemoveFiles({ files: [".github/codecov.yaml", "codecov.yaml"] })] };
	}
});

//#endregion
export { blockCodecov };
//# sourceMappingURL=blockCodecov.js.map