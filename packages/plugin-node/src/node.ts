import { createPlugin } from "@flint.fyi/core";

import assertStrict from "./rules/assertStrict.js";
import assertStyles from "./rules/assertStyles.js";
import blobReadingMethods from "./rules/blobReadingMethods.js";
import bufferAllocators from "./rules/bufferAllocators.js";
import consoleSpaces from "./rules/consoleSpaces.js";
import eventClasses from "./rules/eventClasses.js";
import exportsAssignments from "./rules/exportsAssignments.js";
import filePathsFromImportMeta from "./rules/filePathsFromImportMeta.js";
import fileReadJSONBuffers from "./rules/fileReadJSONBuffers.js";
import nodeProtocols from "./rules/nodeProtocols.js";
import processExits from "./rules/processExits.js";
import unsupportedNodeAPIs from "./rules/unsupportedNodeAPIs.js";

export const node = createPlugin({
	name: "Node.js",
	rules: [
		assertStrict,
		assertStyles,
		blobReadingMethods,
		bufferAllocators,
		consoleSpaces,
		eventClasses,
		exportsAssignments,
		filePathsFromImportMeta,
		fileReadJSONBuffers,
		nodeProtocols,
		processExits,
		unsupportedNodeAPIs,
	],
});
