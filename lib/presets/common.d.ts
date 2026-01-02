import * as bingo_stratum99 from "bingo-stratum";
import * as zod386 from "zod";

//#region src/presets/common.d.ts
declare const presetCommon: bingo_stratum99.Preset<{
  access: zod386.ZodUnion<[zod386.ZodLiteral<"public">, zod386.ZodLiteral<"restricted">]>;
  author: zod386.ZodOptional<zod386.ZodString>;
  bin: zod386.ZodOptional<zod386.ZodUnion<[zod386.ZodString, zod386.ZodRecord<zod386.ZodString, zod386.ZodString>]>>;
  contributors: zod386.ZodOptional<zod386.ZodArray<zod386.ZodObject<{
    avatar_url: zod386.ZodString;
    contributions: zod386.ZodArray<zod386.ZodString, "many">;
    login: zod386.ZodString;
    name: zod386.ZodString;
    profile: zod386.ZodString;
  }, "strip", zod386.ZodTypeAny, {
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
  description: zod386.ZodDefault<zod386.ZodString>;
  directory: zod386.ZodString;
  documentation: zod386.ZodObject<{
    development: zod386.ZodOptional<zod386.ZodString>;
    readme: zod386.ZodObject<{
      additional: zod386.ZodOptional<zod386.ZodString>;
      explainer: zod386.ZodOptional<zod386.ZodString>;
      footnotes: zod386.ZodOptional<zod386.ZodString>;
      usage: zod386.ZodOptional<zod386.ZodString>;
    }, "strip", zod386.ZodTypeAny, {
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
  }, "strip", zod386.ZodTypeAny, {
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
  email: zod386.ZodEffects<zod386.ZodUnion<[zod386.ZodString, zod386.ZodObject<{
    github: zod386.ZodString;
    npm: zod386.ZodString;
  }, "strip", zod386.ZodTypeAny, {
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
  emoji: zod386.ZodOptional<zod386.ZodString>;
  existingLabels: zod386.ZodOptional<zod386.ZodArray<zod386.ZodObject<{
    color: zod386.ZodString;
    description: zod386.ZodString;
    name: zod386.ZodString;
  }, "strip", zod386.ZodTypeAny, {
    name: string;
    description: string;
    color: string;
  }, {
    name: string;
    description: string;
    color: string;
  }>, "many">>;
  funding: zod386.ZodOptional<zod386.ZodString>;
  guide: zod386.ZodOptional<zod386.ZodObject<{
    href: zod386.ZodString;
    title: zod386.ZodString;
  }, "strip", zod386.ZodTypeAny, {
    href: string;
    title: string;
  }, {
    href: string;
    title: string;
  }>>;
  keywords: zod386.ZodOptional<zod386.ZodArray<zod386.ZodString, "many">>;
  logo: zod386.ZodOptional<zod386.ZodObject<{
    alt: zod386.ZodString;
    height: zod386.ZodOptional<zod386.ZodNumber>;
    src: zod386.ZodString;
    width: zod386.ZodOptional<zod386.ZodNumber>;
  }, "strip", zod386.ZodTypeAny, {
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
  node: zod386.ZodObject<{
    minimum: zod386.ZodString;
    pinned: zod386.ZodOptional<zod386.ZodString>;
  }, "strip", zod386.ZodTypeAny, {
    minimum: string;
    pinned?: string | undefined;
  }, {
    minimum: string;
    pinned?: string | undefined;
  }>;
  owner: zod386.ZodString;
  packageData: zod386.ZodOptional<zod386.ZodObject<{
    dependencies: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodString>>;
    devDependencies: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodString>>;
    peerDependencies: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodString>>;
    peerDependenciesMeta: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodUnknown>>;
    scripts: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodOptional<zod386.ZodString>>>;
  }, "strip", zod386.ZodTypeAny, {
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
  pnpm: zod386.ZodOptional<zod386.ZodString>;
  repository: zod386.ZodString;
  rulesetId: zod386.ZodOptional<zod386.ZodString>;
  title: zod386.ZodString;
  type: zod386.ZodOptional<zod386.ZodUnion<[zod386.ZodLiteral<"commonjs">, zod386.ZodLiteral<"module">]>>;
  version: zod386.ZodOptional<zod386.ZodString>;
  words: zod386.ZodOptional<zod386.ZodArray<zod386.ZodString, "many">>;
  workflowsVersions: zod386.ZodOptional<zod386.ZodRecord<zod386.ZodString, zod386.ZodRecord<zod386.ZodString, zod386.ZodObject<{
    hash: zod386.ZodOptional<zod386.ZodString>;
    pinned: zod386.ZodOptional<zod386.ZodBoolean>;
  }, "strip", zod386.ZodTypeAny, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>>>>;
}>;
//#endregion
export { presetCommon };
//# sourceMappingURL=common.d.ts.map