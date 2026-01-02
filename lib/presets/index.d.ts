import { presetCommon } from "./common.js";
import { presetEverything } from "./everything.js";
import { presetMinimal } from "./minimal.js";
import * as bingo_stratum107 from "bingo-stratum";
import * as zod644 from "zod";

//#region src/presets/index.d.ts
declare const presets: {
  common: bingo_stratum107.Preset<{
    access: zod644.ZodUnion<[zod644.ZodLiteral<"public">, zod644.ZodLiteral<"restricted">]>;
    author: zod644.ZodOptional<zod644.ZodString>;
    bin: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodString>]>>;
    contributors: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      avatar_url: zod644.ZodString;
      contributions: zod644.ZodArray<zod644.ZodString, "many">;
      login: zod644.ZodString;
      name: zod644.ZodString;
      profile: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    description: zod644.ZodDefault<zod644.ZodString>;
    directory: zod644.ZodString;
    documentation: zod644.ZodObject<{
      development: zod644.ZodOptional<zod644.ZodString>;
      readme: zod644.ZodObject<{
        additional: zod644.ZodOptional<zod644.ZodString>;
        explainer: zod644.ZodOptional<zod644.ZodString>;
        footnotes: zod644.ZodOptional<zod644.ZodString>;
        usage: zod644.ZodOptional<zod644.ZodString>;
      }, "strip", zod644.ZodTypeAny, {
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
    }, "strip", zod644.ZodTypeAny, {
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
    email: zod644.ZodEffects<zod644.ZodUnion<[zod644.ZodString, zod644.ZodObject<{
      github: zod644.ZodString;
      npm: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    emoji: zod644.ZodOptional<zod644.ZodString>;
    existingLabels: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      color: zod644.ZodString;
      description: zod644.ZodString;
      name: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      name: string;
      description: string;
      color: string;
    }, {
      name: string;
      description: string;
      color: string;
    }>, "many">>;
    funding: zod644.ZodOptional<zod644.ZodString>;
    guide: zod644.ZodOptional<zod644.ZodObject<{
      href: zod644.ZodString;
      title: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      href: string;
      title: string;
    }, {
      href: string;
      title: string;
    }>>;
    keywords: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    logo: zod644.ZodOptional<zod644.ZodObject<{
      alt: zod644.ZodString;
      height: zod644.ZodOptional<zod644.ZodNumber>;
      src: zod644.ZodString;
      width: zod644.ZodOptional<zod644.ZodNumber>;
    }, "strip", zod644.ZodTypeAny, {
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
    node: zod644.ZodObject<{
      minimum: zod644.ZodString;
      pinned: zod644.ZodOptional<zod644.ZodString>;
    }, "strip", zod644.ZodTypeAny, {
      minimum: string;
      pinned?: string | undefined;
    }, {
      minimum: string;
      pinned?: string | undefined;
    }>;
    owner: zod644.ZodString;
    packageData: zod644.ZodOptional<zod644.ZodObject<{
      dependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      devDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependenciesMeta: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodUnknown>>;
      scripts: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodOptional<zod644.ZodString>>>;
    }, "strip", zod644.ZodTypeAny, {
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
    pnpm: zod644.ZodOptional<zod644.ZodString>;
    repository: zod644.ZodString;
    rulesetId: zod644.ZodOptional<zod644.ZodString>;
    title: zod644.ZodString;
    type: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodLiteral<"commonjs">, zod644.ZodLiteral<"module">]>>;
    version: zod644.ZodOptional<zod644.ZodString>;
    words: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    workflowsVersions: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodObject<{
      hash: zod644.ZodOptional<zod644.ZodString>;
      pinned: zod644.ZodOptional<zod644.ZodBoolean>;
    }, "strip", zod644.ZodTypeAny, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }>>>>;
  }>;
  everything: bingo_stratum107.Preset<{
    access: zod644.ZodUnion<[zod644.ZodLiteral<"public">, zod644.ZodLiteral<"restricted">]>;
    author: zod644.ZodOptional<zod644.ZodString>;
    bin: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodString>]>>;
    contributors: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      avatar_url: zod644.ZodString;
      contributions: zod644.ZodArray<zod644.ZodString, "many">;
      login: zod644.ZodString;
      name: zod644.ZodString;
      profile: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    description: zod644.ZodDefault<zod644.ZodString>;
    directory: zod644.ZodString;
    documentation: zod644.ZodObject<{
      development: zod644.ZodOptional<zod644.ZodString>;
      readme: zod644.ZodObject<{
        additional: zod644.ZodOptional<zod644.ZodString>;
        explainer: zod644.ZodOptional<zod644.ZodString>;
        footnotes: zod644.ZodOptional<zod644.ZodString>;
        usage: zod644.ZodOptional<zod644.ZodString>;
      }, "strip", zod644.ZodTypeAny, {
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
    }, "strip", zod644.ZodTypeAny, {
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
    email: zod644.ZodEffects<zod644.ZodUnion<[zod644.ZodString, zod644.ZodObject<{
      github: zod644.ZodString;
      npm: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    emoji: zod644.ZodOptional<zod644.ZodString>;
    existingLabels: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      color: zod644.ZodString;
      description: zod644.ZodString;
      name: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      name: string;
      description: string;
      color: string;
    }, {
      name: string;
      description: string;
      color: string;
    }>, "many">>;
    funding: zod644.ZodOptional<zod644.ZodString>;
    guide: zod644.ZodOptional<zod644.ZodObject<{
      href: zod644.ZodString;
      title: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      href: string;
      title: string;
    }, {
      href: string;
      title: string;
    }>>;
    keywords: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    logo: zod644.ZodOptional<zod644.ZodObject<{
      alt: zod644.ZodString;
      height: zod644.ZodOptional<zod644.ZodNumber>;
      src: zod644.ZodString;
      width: zod644.ZodOptional<zod644.ZodNumber>;
    }, "strip", zod644.ZodTypeAny, {
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
    node: zod644.ZodObject<{
      minimum: zod644.ZodString;
      pinned: zod644.ZodOptional<zod644.ZodString>;
    }, "strip", zod644.ZodTypeAny, {
      minimum: string;
      pinned?: string | undefined;
    }, {
      minimum: string;
      pinned?: string | undefined;
    }>;
    owner: zod644.ZodString;
    packageData: zod644.ZodOptional<zod644.ZodObject<{
      dependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      devDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependenciesMeta: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodUnknown>>;
      scripts: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodOptional<zod644.ZodString>>>;
    }, "strip", zod644.ZodTypeAny, {
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
    pnpm: zod644.ZodOptional<zod644.ZodString>;
    repository: zod644.ZodString;
    rulesetId: zod644.ZodOptional<zod644.ZodString>;
    title: zod644.ZodString;
    type: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodLiteral<"commonjs">, zod644.ZodLiteral<"module">]>>;
    version: zod644.ZodOptional<zod644.ZodString>;
    words: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    workflowsVersions: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodObject<{
      hash: zod644.ZodOptional<zod644.ZodString>;
      pinned: zod644.ZodOptional<zod644.ZodBoolean>;
    }, "strip", zod644.ZodTypeAny, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }>>>>;
  }>;
  minimal: bingo_stratum107.Preset<{
    access: zod644.ZodUnion<[zod644.ZodLiteral<"public">, zod644.ZodLiteral<"restricted">]>;
    author: zod644.ZodOptional<zod644.ZodString>;
    bin: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodString>]>>;
    contributors: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      avatar_url: zod644.ZodString;
      contributions: zod644.ZodArray<zod644.ZodString, "many">;
      login: zod644.ZodString;
      name: zod644.ZodString;
      profile: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    description: zod644.ZodDefault<zod644.ZodString>;
    directory: zod644.ZodString;
    documentation: zod644.ZodObject<{
      development: zod644.ZodOptional<zod644.ZodString>;
      readme: zod644.ZodObject<{
        additional: zod644.ZodOptional<zod644.ZodString>;
        explainer: zod644.ZodOptional<zod644.ZodString>;
        footnotes: zod644.ZodOptional<zod644.ZodString>;
        usage: zod644.ZodOptional<zod644.ZodString>;
      }, "strip", zod644.ZodTypeAny, {
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
    }, "strip", zod644.ZodTypeAny, {
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
    email: zod644.ZodEffects<zod644.ZodUnion<[zod644.ZodString, zod644.ZodObject<{
      github: zod644.ZodString;
      npm: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
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
    emoji: zod644.ZodOptional<zod644.ZodString>;
    existingLabels: zod644.ZodOptional<zod644.ZodArray<zod644.ZodObject<{
      color: zod644.ZodString;
      description: zod644.ZodString;
      name: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      name: string;
      description: string;
      color: string;
    }, {
      name: string;
      description: string;
      color: string;
    }>, "many">>;
    funding: zod644.ZodOptional<zod644.ZodString>;
    guide: zod644.ZodOptional<zod644.ZodObject<{
      href: zod644.ZodString;
      title: zod644.ZodString;
    }, "strip", zod644.ZodTypeAny, {
      href: string;
      title: string;
    }, {
      href: string;
      title: string;
    }>>;
    keywords: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    logo: zod644.ZodOptional<zod644.ZodObject<{
      alt: zod644.ZodString;
      height: zod644.ZodOptional<zod644.ZodNumber>;
      src: zod644.ZodString;
      width: zod644.ZodOptional<zod644.ZodNumber>;
    }, "strip", zod644.ZodTypeAny, {
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
    node: zod644.ZodObject<{
      minimum: zod644.ZodString;
      pinned: zod644.ZodOptional<zod644.ZodString>;
    }, "strip", zod644.ZodTypeAny, {
      minimum: string;
      pinned?: string | undefined;
    }, {
      minimum: string;
      pinned?: string | undefined;
    }>;
    owner: zod644.ZodString;
    packageData: zod644.ZodOptional<zod644.ZodObject<{
      dependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      devDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependencies: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodString>>;
      peerDependenciesMeta: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodUnknown>>;
      scripts: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodOptional<zod644.ZodString>>>;
    }, "strip", zod644.ZodTypeAny, {
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
    pnpm: zod644.ZodOptional<zod644.ZodString>;
    repository: zod644.ZodString;
    rulesetId: zod644.ZodOptional<zod644.ZodString>;
    title: zod644.ZodString;
    type: zod644.ZodOptional<zod644.ZodUnion<[zod644.ZodLiteral<"commonjs">, zod644.ZodLiteral<"module">]>>;
    version: zod644.ZodOptional<zod644.ZodString>;
    words: zod644.ZodOptional<zod644.ZodArray<zod644.ZodString, "many">>;
    workflowsVersions: zod644.ZodOptional<zod644.ZodRecord<zod644.ZodString, zod644.ZodRecord<zod644.ZodString, zod644.ZodObject<{
      hash: zod644.ZodOptional<zod644.ZodString>;
      pinned: zod644.ZodOptional<zod644.ZodBoolean>;
    }, "strip", zod644.ZodTypeAny, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }, {
      hash?: string | undefined;
      pinned?: boolean | undefined;
    }>>>>;
  }>;
};
//#endregion
export { presetCommon, presetEverything, presetMinimal, presets };
//# sourceMappingURL=index.d.ts.map