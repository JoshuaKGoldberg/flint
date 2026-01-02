import * as bingo_stratum98 from "bingo-stratum";
import * as zod257 from "zod";

//#region src/presets/minimal.d.ts
declare const presetMinimal: bingo_stratum98.Preset<{
  access: zod257.ZodUnion<[zod257.ZodLiteral<"public">, zod257.ZodLiteral<"restricted">]>;
  author: zod257.ZodOptional<zod257.ZodString>;
  bin: zod257.ZodOptional<zod257.ZodUnion<[zod257.ZodString, zod257.ZodRecord<zod257.ZodString, zod257.ZodString>]>>;
  contributors: zod257.ZodOptional<zod257.ZodArray<zod257.ZodObject<{
    avatar_url: zod257.ZodString;
    contributions: zod257.ZodArray<zod257.ZodString, "many">;
    login: zod257.ZodString;
    name: zod257.ZodString;
    profile: zod257.ZodString;
  }, "strip", zod257.ZodTypeAny, {
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
  description: zod257.ZodDefault<zod257.ZodString>;
  directory: zod257.ZodString;
  documentation: zod257.ZodObject<{
    development: zod257.ZodOptional<zod257.ZodString>;
    readme: zod257.ZodObject<{
      additional: zod257.ZodOptional<zod257.ZodString>;
      explainer: zod257.ZodOptional<zod257.ZodString>;
      footnotes: zod257.ZodOptional<zod257.ZodString>;
      usage: zod257.ZodOptional<zod257.ZodString>;
    }, "strip", zod257.ZodTypeAny, {
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
  }, "strip", zod257.ZodTypeAny, {
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
  email: zod257.ZodEffects<zod257.ZodUnion<[zod257.ZodString, zod257.ZodObject<{
    github: zod257.ZodString;
    npm: zod257.ZodString;
  }, "strip", zod257.ZodTypeAny, {
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
  emoji: zod257.ZodOptional<zod257.ZodString>;
  existingLabels: zod257.ZodOptional<zod257.ZodArray<zod257.ZodObject<{
    color: zod257.ZodString;
    description: zod257.ZodString;
    name: zod257.ZodString;
  }, "strip", zod257.ZodTypeAny, {
    name: string;
    description: string;
    color: string;
  }, {
    name: string;
    description: string;
    color: string;
  }>, "many">>;
  funding: zod257.ZodOptional<zod257.ZodString>;
  guide: zod257.ZodOptional<zod257.ZodObject<{
    href: zod257.ZodString;
    title: zod257.ZodString;
  }, "strip", zod257.ZodTypeAny, {
    href: string;
    title: string;
  }, {
    href: string;
    title: string;
  }>>;
  keywords: zod257.ZodOptional<zod257.ZodArray<zod257.ZodString, "many">>;
  logo: zod257.ZodOptional<zod257.ZodObject<{
    alt: zod257.ZodString;
    height: zod257.ZodOptional<zod257.ZodNumber>;
    src: zod257.ZodString;
    width: zod257.ZodOptional<zod257.ZodNumber>;
  }, "strip", zod257.ZodTypeAny, {
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
  node: zod257.ZodObject<{
    minimum: zod257.ZodString;
    pinned: zod257.ZodOptional<zod257.ZodString>;
  }, "strip", zod257.ZodTypeAny, {
    minimum: string;
    pinned?: string | undefined;
  }, {
    minimum: string;
    pinned?: string | undefined;
  }>;
  owner: zod257.ZodString;
  packageData: zod257.ZodOptional<zod257.ZodObject<{
    dependencies: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodString>>;
    devDependencies: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodString>>;
    peerDependencies: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodString>>;
    peerDependenciesMeta: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodUnknown>>;
    scripts: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodOptional<zod257.ZodString>>>;
  }, "strip", zod257.ZodTypeAny, {
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
  pnpm: zod257.ZodOptional<zod257.ZodString>;
  repository: zod257.ZodString;
  rulesetId: zod257.ZodOptional<zod257.ZodString>;
  title: zod257.ZodString;
  type: zod257.ZodOptional<zod257.ZodUnion<[zod257.ZodLiteral<"commonjs">, zod257.ZodLiteral<"module">]>>;
  version: zod257.ZodOptional<zod257.ZodString>;
  words: zod257.ZodOptional<zod257.ZodArray<zod257.ZodString, "many">>;
  workflowsVersions: zod257.ZodOptional<zod257.ZodRecord<zod257.ZodString, zod257.ZodRecord<zod257.ZodString, zod257.ZodObject<{
    hash: zod257.ZodOptional<zod257.ZodString>;
    pinned: zod257.ZodOptional<zod257.ZodBoolean>;
  }, "strip", zod257.ZodTypeAny, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>>>>;
}>;
//#endregion
export { presetMinimal };
//# sourceMappingURL=minimal.d.ts.map