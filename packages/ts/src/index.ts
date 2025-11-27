export { getTSNodeRange } from "./getTSNodeRange.js";
export * from "./language.js";
// TODO: maybe it worth adding another export entry?
// For example '@flint.fyi/ts/utils'
export * from "./createTypeScriptFileFromProgram.js";
export { extractDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";
export type { TSNodesByName } from "./nodes.js";
export * from "./normalizeRange.js";
export { ts } from "./plugin.js";
export * from "./prepareTypeScriptFile.js";
export { getDeclarationsIfGlobal } from "./utils/getDeclarationsIfGlobal.js";
export { isGlobalDeclaration } from "./utils/isGlobalDeclaration.js";
export { isGlobalDeclarationOfName } from "./utils/isGlobalDeclarationOfName.js";
export { isGlobalVariable } from "./utils/isGlobalVariable.js";
