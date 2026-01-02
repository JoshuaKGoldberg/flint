import * as bingo_stratum25 from "bingo-stratum";

//#region src/blocks/blockVitest.d.ts
declare const blockVitest: bingo_stratum25.BlockWithAddons<{
  exclude: string[];
  actionSteps: ({
    env?: Record<string, string> | undefined;
    if?: string | undefined;
    with?: Record<string, string> | undefined;
  } & ({
    run: string;
  } | {
    uses: string;
  }))[];
  coverage: {
    exclude?: string[] | undefined;
    include?: string[] | undefined;
  };
  flags: string[];
  environment?: string | undefined;
}, {
  access: "public" | "restricted";
  description: string;
  directory: string;
  documentation: {
    readme: {
      additional?: string | undefined;
      explainer?: string | undefined;
      footnotes?: string | undefined;
      usage?: string | undefined;
    };
    development?: string | undefined;
  };
  email: {
    github: string;
    npm: string;
  };
  title: string;
  node: {
    minimum: string;
    pinned?: string | undefined;
  };
  owner: string;
  repository: string;
  type?: "commonjs" | "module" | undefined;
  author?: string | undefined;
  bin?: string | Record<string, string> | undefined;
  contributors?: {
    avatar_url: string;
    contributions: string[];
    login: string;
    name: string;
    profile: string;
  }[] | undefined;
  emoji?: string | undefined;
  existingLabels?: {
    name: string;
    description: string;
    color: string;
  }[] | undefined;
  funding?: string | undefined;
  guide?: {
    href: string;
    title: string;
  } | undefined;
  keywords?: string[] | undefined;
  logo?: {
    alt: string;
    src: string;
    height?: number | undefined;
    width?: number | undefined;
  } | undefined;
  packageData?: {
    dependencies?: Record<string, string> | undefined;
    devDependencies?: Record<string, string> | undefined;
    peerDependencies?: Record<string, string> | undefined;
    peerDependenciesMeta?: Record<string, unknown> | undefined;
    scripts?: Record<string, string | undefined> | undefined;
  } | undefined;
  pnpm?: string | undefined;
  rulesetId?: string | undefined;
  version?: string | undefined;
  words?: string[] | undefined;
  workflowsVersions?: Record<string, Record<string, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>> | undefined;
}>;
//#endregion
export { blockVitest };
//# sourceMappingURL=blockVitest.d.ts.map