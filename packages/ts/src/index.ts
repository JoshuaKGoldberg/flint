export { convertTypeScriptDiagnosticToLanguageFileDiagnostic } from "./convertTypeScriptDiagnosticToLanguageFileDiagnostic.js";
export {
	collectTypeScriptFileCacheImpacts,
	NodeSyntaxKinds,
} from "./createTypeScriptFileFromProgram.js";
export {
	extractDirectivesFromTypeScriptFile,
	type ExtractedDirective,
} from "./directives/parseDirectivesFromTypeScriptFile.js";
export { getTSNodeRange } from "./getTSNodeRange.js";
export * from "./language.js";
export type { TSNodesByName } from "./nodes.js";
export { ts } from "./plugin.js";
export {
	prepareTypeScriptBasedLanguage,
	type TypeScriptBasedLanguageFile,
	type TypeScriptBasedLanguageFileFactoryDefinition,
} from "./prepareTypeScriptBasedLanguage.js";
export { getDeclarationsIfGlobal } from "./utils/getDeclarationsIfGlobal.js";
export { isGlobalDeclaration } from "./utils/isGlobalDeclaration.js";
export { isGlobalDeclarationOfName } from "./utils/isGlobalDeclarationOfName.js";
export { isGlobalVariable } from "./utils/isGlobalVariable.js";
