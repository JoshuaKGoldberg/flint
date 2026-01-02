import { WorkflowsVersions } from "../../schemas.js";

//#region src/blocks/files/createMultiWorkflowFile.d.ts
interface MultiWorkflowFileOptions {
  jobs: MultiWorkflowJobOptions[];
  name: string;
  workflowsVersions: undefined | WorkflowsVersions;
}
interface MultiWorkflowJobOptions {
  checkoutWith?: Record<string, string>;
  if?: string;
  name: string;
  steps: MultiWorkflowJobStep[];
}
type MultiWorkflowJobStep = {
  if?: string;
} & ({
  run: string;
} | {
  uses: string;
});
declare function createMultiWorkflowFile({
  jobs,
  name,
  workflowsVersions
}: MultiWorkflowFileOptions): string;
//#endregion
export { MultiWorkflowFileOptions, MultiWorkflowJobOptions, MultiWorkflowJobStep, createMultiWorkflowFile };
//# sourceMappingURL=createMultiWorkflowFile.d.ts.map