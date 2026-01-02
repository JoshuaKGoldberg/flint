import * as zod0 from "zod";
import * as bingo_stratum_lib_types_templates_js0 from "bingo-stratum/lib/types/templates.js";

//#region src/template.d.ts
declare const template: bingo_stratum_lib_types_templates_js0.StratumTemplate<{
  access: zod0.ZodUnion<[zod0.ZodLiteral<"public">, zod0.ZodLiteral<"restricted">]>;
  author: zod0.ZodOptional<zod0.ZodString>;
  bin: zod0.ZodOptional<zod0.ZodUnion<[zod0.ZodString, zod0.ZodRecord<zod0.ZodString, zod0.ZodString>]>>;
  contributors: zod0.ZodOptional<zod0.ZodArray<zod0.ZodObject<{
    avatar_url: zod0.ZodString;
    contributions: zod0.ZodArray<zod0.ZodString, "many">;
    login: zod0.ZodString;
    name: zod0.ZodString;
    profile: zod0.ZodString;
  }, "strip", zod0.ZodTypeAny, {
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
  description: zod0.ZodDefault<zod0.ZodString>;
  directory: zod0.ZodString;
  documentation: zod0.ZodObject<{
    development: zod0.ZodOptional<zod0.ZodString>;
    readme: zod0.ZodObject<{
      additional: zod0.ZodOptional<zod0.ZodString>;
      explainer: zod0.ZodOptional<zod0.ZodString>;
      footnotes: zod0.ZodOptional<zod0.ZodString>;
      usage: zod0.ZodOptional<zod0.ZodString>;
    }, "strip", zod0.ZodTypeAny, {
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
  }, "strip", zod0.ZodTypeAny, {
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
  email: zod0.ZodEffects<zod0.ZodUnion<[zod0.ZodString, zod0.ZodObject<{
    github: zod0.ZodString;
    npm: zod0.ZodString;
  }, "strip", zod0.ZodTypeAny, {
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
  emoji: zod0.ZodOptional<zod0.ZodString>;
  existingLabels: zod0.ZodOptional<zod0.ZodArray<zod0.ZodObject<{
    color: zod0.ZodString;
    description: zod0.ZodString;
    name: zod0.ZodString;
  }, "strip", zod0.ZodTypeAny, {
    name: string;
    description: string;
    color: string;
  }, {
    name: string;
    description: string;
    color: string;
  }>, "many">>;
  funding: zod0.ZodOptional<zod0.ZodString>;
  guide: zod0.ZodOptional<zod0.ZodObject<{
    href: zod0.ZodString;
    title: zod0.ZodString;
  }, "strip", zod0.ZodTypeAny, {
    href: string;
    title: string;
  }, {
    href: string;
    title: string;
  }>>;
  keywords: zod0.ZodOptional<zod0.ZodArray<zod0.ZodString, "many">>;
  logo: zod0.ZodOptional<zod0.ZodObject<{
    alt: zod0.ZodString;
    height: zod0.ZodOptional<zod0.ZodNumber>;
    src: zod0.ZodString;
    width: zod0.ZodOptional<zod0.ZodNumber>;
  }, "strip", zod0.ZodTypeAny, {
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
  node: zod0.ZodObject<{
    minimum: zod0.ZodString;
    pinned: zod0.ZodOptional<zod0.ZodString>;
  }, "strip", zod0.ZodTypeAny, {
    minimum: string;
    pinned?: string | undefined;
  }, {
    minimum: string;
    pinned?: string | undefined;
  }>;
  owner: zod0.ZodString;
  packageData: zod0.ZodOptional<zod0.ZodObject<{
    dependencies: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodString>>;
    devDependencies: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodString>>;
    peerDependencies: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodString>>;
    peerDependenciesMeta: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodUnknown>>;
    scripts: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodOptional<zod0.ZodString>>>;
  }, "strip", zod0.ZodTypeAny, {
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
  pnpm: zod0.ZodOptional<zod0.ZodString>;
  repository: zod0.ZodString;
  rulesetId: zod0.ZodOptional<zod0.ZodString>;
  title: zod0.ZodString;
  type: zod0.ZodOptional<zod0.ZodUnion<[zod0.ZodLiteral<"commonjs">, zod0.ZodLiteral<"module">]>>;
  version: zod0.ZodOptional<zod0.ZodString>;
  words: zod0.ZodOptional<zod0.ZodArray<zod0.ZodString, "many">>;
  workflowsVersions: zod0.ZodOptional<zod0.ZodRecord<zod0.ZodString, zod0.ZodRecord<zod0.ZodString, zod0.ZodObject<{
    hash: zod0.ZodOptional<zod0.ZodString>;
    pinned: zod0.ZodOptional<zod0.ZodBoolean>;
  }, "strip", zod0.ZodTypeAny, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>>>>;
}>;
//#endregion
export { template };
//# sourceMappingURL=template.d.ts.map