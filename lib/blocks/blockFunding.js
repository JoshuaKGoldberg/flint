import { base } from "../base.js";
import { formatYaml } from "./files/formatYaml.js";

//#region src/blocks/blockFunding.ts
const blockFunding = base.createBlock({
	about: { name: "Funding" },
	produce({ options }) {
		return { files: { ".github": { "FUNDING.yaml": options.funding && formatYaml({ github: options.funding }) } } };
	}
});

//#endregion
export { blockFunding };
//# sourceMappingURL=blockFunding.js.map