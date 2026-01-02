import * as bingo_stratum106 from "bingo-stratum";
import * as zod515 from "zod";

//#region src/presets/everything.d.ts
declare const presetEverything: bingo_stratum106.Preset<{
  access: zod515.ZodUnion<[zod515.ZodLiteral<"public">, zod515.ZodLiteral<"restricted">]>;
  author: zod515.ZodOptional<zod515.ZodString>;
  bin: zod515.ZodOptional<zod515.ZodUnion<[zod515.ZodString, zod515.ZodRecord<zod515.ZodString, zod515.ZodString>]>>;
  contributors: zod515.ZodOptional<zod515.ZodArray<zod515.ZodObject<{
    avatar_url: zod515.ZodString;
    contributions: zod515.ZodArray<zod515.ZodString, "many">;
    login: zod515.ZodString;
    name: zod515.ZodString;
    profile: zod515.ZodString;
  }, "strip", zod515.ZodTypeAny, {
    avatar_url: string;
    contributions: string[];
    login: string;
    name: string;
    profile: string;
  }, {
    avatar_url: string;
    contributions: string[];
    login: string;
    name: string;
    profile: string;
  }>, "many">>;
  description: zod515.ZodDefault<zod515.ZodString>;
  directory: zod515.ZodString;
  documentation: zod515.ZodObject<{
    development: zod515.ZodOptional<zod515.ZodString>;
    readme: zod515.ZodObject<{
      additional: zod515.ZodOptional<zod515.ZodString>;
      explainer: zod515.ZodOptional<zod515.ZodString>;
      footnotes: zod515.ZodOptional<zod515.ZodString>;
      usage: zod515.ZodOptional<zod515.ZodString>;
    }, "strip", zod515.ZodTypeAny, {
      additional?: string | undefined;
      explainer?: string | undefined;
      footnotes?: string | undefined;
      usage?: string | undefined;
    }, {
      additional?: string | undefined;
      explainer?: string | undefined;
      footnotes?: string | undefined;
      usage?: string | undefined;
    }>;
  }, "strip", zod515.ZodTypeAny, {
    readme: {
      additional?: string | undefined;
      explainer?: string | undefined;
      footnotes?: string | undefined;
      usage?: string | undefined;
    };
    development?: string | undefined;
  }, {
    readme: {
      additional?: string | undefined;
      explainer?: string | undefined;
      footnotes?: string | undefined;
      usage?: string | undefined;
    };
    development?: string | undefined;
  }>;
  email: zod515.ZodEffects<zod515.ZodUnion<[zod515.ZodString, zod515.ZodObject<{
    github: zod515.ZodString;
    npm: zod515.ZodString;
  }, "strip", zod515.ZodTypeAny, {
    github: string;
    npm: string;
  }, {
    github: string;
    npm: string;
  }>]>, {
    github: string;
    npm: string;
  }, string | {
    github: string;
    npm: string;
  }>;
  emoji: zod515.ZodOptional<zod515.ZodString>;
  existingLabels: zod515.ZodOptional<zod515.ZodArray<zod515.ZodObject<{
    color: zod515.ZodString;
    description: zod515.ZodString;
    name: zod515.ZodString;
  }, "strip", zod515.ZodTypeAny, {
    name: string;
    description: string;
    color: string;
  }, {
    name: string;
    description: string;
    color: string;
  }>, "many">>;
  funding: zod515.ZodOptional<zod515.ZodString>;
  guide: zod515.ZodOptional<zod515.ZodObject<{
    href: zod515.ZodString;
    title: zod515.ZodString;
  }, "strip", zod515.ZodTypeAny, {
    href: string;
    title: string;
  }, {
    href: string;
    title: string;
  }>>;
  keywords: zod515.ZodOptional<zod515.ZodArray<zod515.ZodString, "many">>;
  logo: zod515.ZodOptional<zod515.ZodObject<{
    alt: zod515.ZodString;
    height: zod515.ZodOptional<zod515.ZodNumber>;
    src: zod515.ZodString;
    width: zod515.ZodOptional<zod515.ZodNumber>;
  }, "strip", zod515.ZodTypeAny, {
    alt: string;
    src: string;
    height?: number | undefined;
    width?: number | undefined;
  }, {
    alt: string;
    src: string;
    height?: number | undefined;
    width?: number | undefined;
  }>>;
  node: zod515.ZodObject<{
    minimum: zod515.ZodString;
    pinned: zod515.ZodOptional<zod515.ZodString>;
  }, "strip", zod515.ZodTypeAny, {
    minimum: string;
    pinned?: string | undefined;
  }, {
    minimum: string;
    pinned?: string | undefined;
  }>;
  owner: zod515.ZodString;
  packageData: zod515.ZodOptional<zod515.ZodObject<{
    dependencies: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodString>>;
    devDependencies: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodString>>;
    peerDependencies: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodString>>;
    peerDependenciesMeta: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodUnknown>>;
    scripts: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodOptional<zod515.ZodString>>>;
  }, "strip", zod515.ZodTypeAny, {
    dependencies?: Record<string, string> | undefined;
    devDependencies?: Record<string, string> | undefined;
    peerDependencies?: Record<string, string> | undefined;
    peerDependenciesMeta?: Record<string, unknown> | undefined;
    scripts?: Record<string, string | undefined> | undefined;
  }, {
    dependencies?: Record<string, string> | undefined;
    devDependencies?: Record<string, string> | undefined;
    peerDependencies?: Record<string, string> | undefined;
    peerDependenciesMeta?: Record<string, unknown> | undefined;
    scripts?: Record<string, string | undefined> | undefined;
  }>>;
  pnpm: zod515.ZodOptional<zod515.ZodString>;
  repository: zod515.ZodString;
  rulesetId: zod515.ZodOptional<zod515.ZodString>;
  title: zod515.ZodString;
  type: zod515.ZodOptional<zod515.ZodUnion<[zod515.ZodLiteral<"commonjs">, zod515.ZodLiteral<"module">]>>;
  version: zod515.ZodOptional<zod515.ZodString>;
  words: zod515.ZodOptional<zod515.ZodArray<zod515.ZodString, "many">>;
  workflowsVersions: zod515.ZodOptional<zod515.ZodRecord<zod515.ZodString, zod515.ZodRecord<zod515.ZodString, zod515.ZodObject<{
    hash: zod515.ZodOptional<zod515.ZodString>;
    pinned: zod515.ZodOptional<zod515.ZodBoolean>;
  }, "strip", zod515.ZodTypeAny, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>>>>;
}>;
//#endregion
export { presetEverything };
//# sourceMappingURL=everything.d.ts.map