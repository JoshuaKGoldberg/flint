import { createJobName } from "./createJobName.js";
import { formatWorkflowYaml } from "./formatWorkflowYaml.js";

//#region src/blocks/files/createSoloWorkflowFile.ts
function createSoloWorkflowFile({ concurrency, jobName, name, on, permissions, ...options }) {
	return formatWorkflowYaml({
		concurrency,
		jobs: { [createJobName(jobName ?? name)]: {
			...options.if && { if: options.if },
			...jobName && { name: jobName },
			"runs-on": "ubuntu-latest",
			steps: options.steps
		} },
		name,
		on,
		permissions
	});
}

//#endregion
export { createSoloWorkflowFile };
//# sourceMappingURL=createSoloWorkflowFile.js.map