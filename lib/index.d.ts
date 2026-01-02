import { BaseOptions, base } from "./base.js";
import { blockAllContributors } from "./blocks/blockAllContributors.js";
import { blockAreTheTypesWrong } from "./blocks/blockAreTheTypesWrong.js";
import { blockCSpell } from "./blocks/blockCSpell.js";
import { blockCTATransitions } from "./blocks/blockCTATransitions.js";
import { blockCodecov } from "./blocks/blockCodecov.js";
import { blockContributingDocs } from "./blocks/blockContributingDocs.js";
import { blockContributorCovenant } from "./blocks/blockContributorCovenant.js";
import { blockDevelopmentDocs } from "./blocks/blockDevelopmentDocs.js";
import { blockESLint } from "./blocks/blockESLint.js";
import { blockESLintComments } from "./blocks/blockESLintComments.js";
import { blockESLintJSDoc } from "./blocks/blockESLintJSDoc.js";
import { blockESLintJSONC } from "./blocks/blockESLintJSONC.js";
import { blockESLintMarkdown } from "./blocks/blockESLintMarkdown.js";
import { blockESLintMoreStyling } from "./blocks/blockESLintMoreStyling.js";
import { blockESLintNode } from "./blocks/blockESLintNode.js";
import { blockESLintPackageJson } from "./blocks/blockESLintPackageJson.js";
import { blockESLintPerfectionist } from "./blocks/blockESLintPerfectionist.js";
import { blockESLintPlugin } from "./blocks/blockESLintPlugin.js";
import { blockESLintRegexp } from "./blocks/blockESLintRegexp.js";
import { blockESLintYML } from "./blocks/blockESLintYML.js";
import { blockFunding } from "./blocks/blockFunding.js";
import { blockGitHubActionsCI } from "./blocks/blockGitHubActionsCI.js";
import { blockGitHubIssueTemplates } from "./blocks/blockGitHubIssueTemplates.js";
import { blockGitHubPRTemplate } from "./blocks/blockGitHubPRTemplate.js";
import { blockGitignore } from "./blocks/blockGitignore.js";
import { blockKnip } from "./blocks/blockKnip.js";
import { blockMITLicense } from "./blocks/blockMITLicense.js";
import { blockMain } from "./blocks/blockMain.js";
import { blockNcc } from "./blocks/blockNcc.js";
import { blockNvmrc } from "./blocks/blockNvmrc.js";
import { blockOctoGuide } from "./blocks/blockOctoGuide.js";
import { blockOctoGuideStrict } from "./blocks/blockOctoGuideStrict.js";
import { blockPackageJson } from "./blocks/blockPackageJson.js";
import { blockPnpmDedupe } from "./blocks/blockPnpmDedupe.js";
import { blockPrettier } from "./blocks/blockPrettier.js";
import { blockPrettierPluginCurly } from "./blocks/blockPrettierPluginCurly.js";
import { blockPrettierPluginPackageJson } from "./blocks/blockPrettierPluginPackageJson.js";
import { blockPrettierPluginSentencesPerLine } from "./blocks/blockPrettierPluginSentencesPerLine.js";
import { blockPrettierPluginSh } from "./blocks/blockPrettierPluginSh.js";
import { blockREADME } from "./blocks/blockREADME.js";
import { blockReleaseIt } from "./blocks/blockReleaseIt.js";
import { blockRenovate } from "./blocks/blockRenovate.js";
import { blockSecurityDocs } from "./blocks/blockSecurityDocs.js";
import { blockTSDown } from "./blocks/blockTSDown.js";
import { blockTemplatedWith } from "./blocks/blockTemplatedWith.js";
import { blockTypeScript } from "./blocks/blockTypeScript.js";
import { blockVSCode } from "./blocks/blockVSCode.js";
import { blockVitest } from "./blocks/blockVitest.js";
import { blockWebExt } from "./blocks/blockWebExt.js";
import { blocks } from "./blocks/index.js";
import { template } from "./template.js";
import { presetCommon } from "./presets/common.js";
import { presetEverything } from "./presets/everything.js";
import { presetMinimal } from "./presets/minimal.js";
import { presets } from "./presets/index.js";
import * as bingo_stratum17 from "bingo-stratum";
import * as zod128 from "zod";
import * as bingo0 from "bingo";
import * as bingo_stratum_lib_types_templates_js0 from "bingo-stratum/lib/types/templates.js";

//#region src/index.d.ts
declare const createConfig: bingo0.CreateTemplateConfig<{
  access: zod128.ZodUnion<[zod128.ZodLiteral<"public">, zod128.ZodLiteral<"restricted">]>;
  author: zod128.ZodOptional<zod128.ZodString>;
  bin: zod128.ZodOptional<zod128.ZodUnion<[zod128.ZodString, zod128.ZodRecord<zod128.ZodString, zod128.ZodString>]>>;
  contributors: zod128.ZodOptional<zod128.ZodArray<zod128.ZodObject<{
    avatar_url: zod128.ZodString;
    contributions: zod128.ZodArray<zod128.ZodString, "many">;
    login: zod128.ZodString;
    name: zod128.ZodString;
    profile: zod128.ZodString;
  }, "strip", zod128.ZodTypeAny, {
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
  description: zod128.ZodDefault<zod128.ZodString>;
  directory: zod128.ZodString;
  documentation: zod128.ZodObject<{
    development: zod128.ZodOptional<zod128.ZodString>;
    readme: zod128.ZodObject<{
      additional: zod128.ZodOptional<zod128.ZodString>;
      explainer: zod128.ZodOptional<zod128.ZodString>;
      footnotes: zod128.ZodOptional<zod128.ZodString>;
      usage: zod128.ZodOptional<zod128.ZodString>;
    }, "strip", zod128.ZodTypeAny, {
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
  }, "strip", zod128.ZodTypeAny, {
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
  email: zod128.ZodEffects<zod128.ZodUnion<[zod128.ZodString, zod128.ZodObject<{
    github: zod128.ZodString;
    npm: zod128.ZodString;
  }, "strip", zod128.ZodTypeAny, {
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
  emoji: zod128.ZodOptional<zod128.ZodString>;
  existingLabels: zod128.ZodOptional<zod128.ZodArray<zod128.ZodObject<{
    color: zod128.ZodString;
    description: zod128.ZodString;
    name: zod128.ZodString;
  }, "strip", zod128.ZodTypeAny, {
    name: string;
    description: string;
    color: string;
  }, {
    name: string;
    description: string;
    color: string;
  }>, "many">>;
  funding: zod128.ZodOptional<zod128.ZodString>;
  guide: zod128.ZodOptional<zod128.ZodObject<{
    href: zod128.ZodString;
    title: zod128.ZodString;
  }, "strip", zod128.ZodTypeAny, {
    href: string;
    title: string;
  }, {
    href: string;
    title: string;
  }>>;
  keywords: zod128.ZodOptional<zod128.ZodArray<zod128.ZodString, "many">>;
  logo: zod128.ZodOptional<zod128.ZodObject<{
    alt: zod128.ZodString;
    height: zod128.ZodOptional<zod128.ZodNumber>;
    src: zod128.ZodString;
    width: zod128.ZodOptional<zod128.ZodNumber>;
  }, "strip", zod128.ZodTypeAny, {
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
  node: zod128.ZodObject<{
    minimum: zod128.ZodString;
    pinned: zod128.ZodOptional<zod128.ZodString>;
  }, "strip", zod128.ZodTypeAny, {
    minimum: string;
    pinned?: string | undefined;
  }, {
    minimum: string;
    pinned?: string | undefined;
  }>;
  owner: zod128.ZodString;
  packageData: zod128.ZodOptional<zod128.ZodObject<{
    dependencies: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodString>>;
    devDependencies: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodString>>;
    peerDependencies: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodString>>;
    peerDependenciesMeta: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodUnknown>>;
    scripts: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodOptional<zod128.ZodString>>>;
  }, "strip", zod128.ZodTypeAny, {
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
  pnpm: zod128.ZodOptional<zod128.ZodString>;
  repository: zod128.ZodString;
  rulesetId: zod128.ZodOptional<zod128.ZodString>;
  title: zod128.ZodString;
  type: zod128.ZodOptional<zod128.ZodUnion<[zod128.ZodLiteral<"commonjs">, zod128.ZodLiteral<"module">]>>;
  version: zod128.ZodOptional<zod128.ZodString>;
  words: zod128.ZodOptional<zod128.ZodArray<zod128.ZodString, "many">>;
  workflowsVersions: zod128.ZodOptional<zod128.ZodRecord<zod128.ZodString, zod128.ZodRecord<zod128.ZodString, zod128.ZodObject<{
    hash: zod128.ZodOptional<zod128.ZodString>;
    pinned: zod128.ZodOptional<zod128.ZodBoolean>;
  }, "strip", zod128.ZodTypeAny, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }, {
    hash?: string | undefined;
    pinned?: boolean | undefined;
  }>>>>;
} & bingo_stratum_lib_types_templates_js0.StratumTemplateOptionsShape, bingo_stratum17.StratumRefinements<{
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
}>>;
//#endregion
export { BaseOptions, base, blockAllContributors, blockAreTheTypesWrong, blockCSpell, blockCTATransitions, blockCodecov, blockContributingDocs, blockContributorCovenant, blockDevelopmentDocs, blockESLint, blockESLintComments, blockESLintJSDoc, blockESLintJSONC, blockESLintMarkdown, blockESLintMoreStyling, blockESLintNode, blockESLintPackageJson, blockESLintPerfectionist, blockESLintPlugin, blockESLintRegexp, blockESLintYML, blockFunding, blockGitHubActionsCI, blockGitHubIssueTemplates, blockGitHubPRTemplate, blockGitignore, blockKnip, blockMITLicense, blockMain, blockNcc, blockNvmrc, blockOctoGuide, blockOctoGuideStrict, blockPackageJson, blockPnpmDedupe, blockPrettier, blockPrettierPluginCurly, blockPrettierPluginPackageJson, blockPrettierPluginSentencesPerLine, blockPrettierPluginSh, blockREADME, blockReleaseIt, blockRenovate, blockSecurityDocs, blockTSDown, blockTemplatedWith, blockTypeScript, blockVSCode, blockVitest, blockWebExt, blocks, createConfig, presetCommon, presetEverything, presetMinimal, presets, template };
//# sourceMappingURL=index.d.ts.map