import { z } from "zod";
import * as bingo1 from "bingo";

//#region src/inputs/inputFromOctokit.d.ts
declare const inputFromOctokit: bingo1.InputWithArgs<Promise<unknown>, {
  endpoint: z.ZodString;
  options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}>;
//#endregion
export { inputFromOctokit };
//# sourceMappingURL=inputFromOctokit.d.ts.map