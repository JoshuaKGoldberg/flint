import { PackageAuthor } from "./readPackageAuthor.js";

//#region src/options/readEmails.d.ts
declare function readEmails(getEmailFromCodeOfConduct: () => Promise<string | undefined>, getEmailFromGit: () => Promise<string | undefined>, getEmailFromNpm: () => Promise<string | undefined>, getPackageAuthor: () => Promise<PackageAuthor>): Promise<{
  github: string;
  npm: string;
} | undefined>;
//#endregion
export { readEmails };
//# sourceMappingURL=readEmails.d.ts.map