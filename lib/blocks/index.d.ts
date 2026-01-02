import { blockAllContributors } from "./blockAllContributors.js";
import { blockAreTheTypesWrong } from "./blockAreTheTypesWrong.js";
import { blockCSpell } from "./blockCSpell.js";
import { blockCTATransitions } from "./blockCTATransitions.js";
import { blockCodecov } from "./blockCodecov.js";
import { blockContributingDocs } from "./blockContributingDocs.js";
import { blockContributorCovenant } from "./blockContributorCovenant.js";
import { blockDevelopmentDocs } from "./blockDevelopmentDocs.js";
import { blockESLint } from "./blockESLint.js";
import { blockESLintComments } from "./blockESLintComments.js";
import { blockESLintJSDoc } from "./blockESLintJSDoc.js";
import { blockESLintJSONC } from "./blockESLintJSONC.js";
import { blockESLintMarkdown } from "./blockESLintMarkdown.js";
import { blockESLintMoreStyling } from "./blockESLintMoreStyling.js";
import { blockESLintNode } from "./blockESLintNode.js";
import { blockESLintPackageJson } from "./blockESLintPackageJson.js";
import { blockESLintPerfectionist } from "./blockESLintPerfectionist.js";
import { blockESLintPlugin } from "./blockESLintPlugin.js";
import { blockESLintRegexp } from "./blockESLintRegexp.js";
import { blockESLintYML } from "./blockESLintYML.js";
import { blockFunding } from "./blockFunding.js";
import { blockGitHubActionsCI } from "./blockGitHubActionsCI.js";
import { blockGitHubIssueTemplates } from "./blockGitHubIssueTemplates.js";
import { blockGitHubPRTemplate } from "./blockGitHubPRTemplate.js";
import { blockGitignore } from "./blockGitignore.js";
import { blockKnip } from "./blockKnip.js";
import { blockMITLicense } from "./blockMITLicense.js";
import { blockMain } from "./blockMain.js";
import { blockNcc } from "./blockNcc.js";
import { blockNvmrc } from "./blockNvmrc.js";
import { blockOctoGuide } from "./blockOctoGuide.js";
import { blockOctoGuideStrict } from "./blockOctoGuideStrict.js";
import { blockPackageJson } from "./blockPackageJson.js";
import { blockPnpmDedupe } from "./blockPnpmDedupe.js";
import { blockPrettier } from "./blockPrettier.js";
import { blockPrettierPluginCurly } from "./blockPrettierPluginCurly.js";
import { blockPrettierPluginPackageJson } from "./blockPrettierPluginPackageJson.js";
import { blockPrettierPluginSentencesPerLine } from "./blockPrettierPluginSentencesPerLine.js";
import { blockPrettierPluginSh } from "./blockPrettierPluginSh.js";
import { blockREADME } from "./blockREADME.js";
import { blockReleaseIt } from "./blockReleaseIt.js";
import { blockRenovate } from "./blockRenovate.js";
import { blockSecurityDocs } from "./blockSecurityDocs.js";
import { blockTSDown } from "./blockTSDown.js";
import { blockTemplatedWith } from "./blockTemplatedWith.js";
import { blockTypeScript } from "./blockTypeScript.js";
import { blockVSCode } from "./blockVSCode.js";
import { blockVitest } from "./blockVitest.js";
import { blockWebExt } from "./blockWebExt.js";
import * as bingo_stratum26 from "bingo-stratum";

//#region src/blocks/index.d.ts
declare const blocks: {
  blockAllContributors: bingo_stratum26.BlockWithoutAddons<{
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
  blockAreTheTypesWrong: bingo_stratum26.BlockWithoutAddons<{
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
  blockCodecov: bingo_stratum26.BlockWithAddons<{
    env?: Record<string, string> | undefined;
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
  blockContributingDocs: bingo_stratum26.BlockWithoutAddons<{
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
  blockContributorCovenant: bingo_stratum26.BlockWithoutAddons<{
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
  blockCSpell: bingo_stratum26.BlockWithAddons<{
    words: string[];
    ignorePaths: string[];
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
  blockDevelopmentDocs: bingo_stratum26.BlockWithAddons<{
    hints: string[];
    sections: Record<string, {
      contents?: string | {
        after?: string[] | undefined;
        before?: string | undefined;
        items?: string[] | undefined;
        plural?: string | undefined;
      } | undefined;
      innerSections?: {
        contents: string;
        heading: string;
      }[] | undefined;
    }>;
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
  blockESLint: bingo_stratum26.BlockWithAddons<{
    imports: {
      source: string | {
        version: string;
        packageName: string;
      };
      specifier: string;
      types?: boolean | undefined;
    }[];
    explanations: string[];
    extensions: {
      files: string[];
      extends?: string[] | undefined;
      languageOptions?: unknown;
      linterOptions?: unknown;
      plugins?: Record<string, string> | undefined;
      rules?: Record<string, "off" | "error" | "warn" | ["error" | "warn", unknown] | ["error" | "warn", unknown, unknown]> | {
        entries: Record<string, "off" | "error" | "warn" | ["error" | "warn", unknown] | ["error" | "warn", unknown, unknown]>;
        comment?: string | undefined;
      }[] | undefined;
      settings?: Record<string, unknown> | undefined;
    }[];
    ignores: string[];
    beforeLint?: string | undefined;
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
  blockESLintComments: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintJSDoc: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintJSONC: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintMarkdown: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintMoreStyling: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintNode: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintPackageJson: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintPerfectionist: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintPlugin: bingo_stratum26.BlockWithAddons<{
    configEmoji?: [string, string][] | undefined;
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
  blockESLintRegexp: bingo_stratum26.BlockWithoutAddons<{
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
  blockESLintYML: bingo_stratum26.BlockWithoutAddons<{
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
  blockFunding: bingo_stratum26.BlockWithoutAddons<{
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
  blockGitHubActionsCI: bingo_stratum26.BlockWithAddons<{
    jobs?: {
      name: string;
      steps: ({
        env?: Record<string, string> | undefined;
        if?: string | undefined;
        with?: Record<string, string> | undefined;
      } & ({
        run: string;
      } | {
        uses: string;
      }))[];
      if?: string | undefined;
      checkoutWith?: Record<string, string> | undefined;
    }[] | undefined;
    nodeVersion?: string | number | undefined;
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
  blockGitHubIssueTemplates: bingo_stratum26.BlockWithoutAddons<{
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
  blockGitHubPRTemplate: bingo_stratum26.BlockWithoutAddons<{
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
  blockGitignore: bingo_stratum26.BlockWithAddons<{
    ignores: string[];
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
  blockKnip: bingo_stratum26.BlockWithAddons<{
    entry?: string[] | undefined;
    ignoreDependencies?: string[] | undefined;
    project?: string[] | undefined;
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
  blockMain: bingo_stratum26.BlockWithAddons<{
    runArgs: string[];
    filePath?: string | undefined;
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
  blockMITLicense: bingo_stratum26.BlockWithoutAddons<{
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
  blockNcc: bingo_stratum26.BlockWithAddons<{
    entry?: string | undefined;
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
  blockNvmrc: bingo_stratum26.BlockWithoutAddons<{
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
  blockOctoGuide: bingo_stratum26.BlockWithAddons<{
    config?: "strict" | "recommended" | undefined;
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
  blockOctoGuideStrict: bingo_stratum26.BlockWithoutAddons<{
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
  blockPackageJson: bingo_stratum26.BlockWithAddons<{
    cleanupCommands: string[];
    properties: {
      type?: "commonjs" | "module" | undefined;
      name?: string | undefined;
      author?: string | {
        name: string;
        url?: string | undefined;
        email?: string | undefined;
      } | undefined;
      bin?: string | Record<string, string> | undefined;
      contributors?: (string | {
        name: string;
        url?: string | undefined;
        email?: string | undefined;
      })[] | undefined;
      description?: string | undefined;
      funding?: string | {
        url: string;
        type?: string | undefined;
      } | (string | {
        url: string;
        type?: string | undefined;
      })[] | undefined;
      keywords?: string[] | undefined;
      dependencies?: Record<string, string> | undefined;
      devDependencies?: Record<string, string> | undefined;
      peerDependencies?: Record<string, string> | undefined;
      peerDependenciesMeta?: Record<string, {
        optional: boolean;
      }> | undefined;
      scripts?: Record<string, string | undefined> | undefined;
      repository?: string | {
        type: string;
        url: string;
        directory?: string | undefined;
      } | undefined;
      module?: string | undefined;
      version?: string | undefined;
      engines?: Record<string, string> | undefined;
      packageManager?: string | undefined;
      files?: string[] | undefined;
      config?: Record<string, unknown> | undefined;
      homepage?: string | undefined;
      bugs?: string | {
        url?: string | undefined;
        email?: string | undefined;
      } | undefined;
      license?: string | undefined;
      maintainers?: (string | {
        name: string;
        url?: string | undefined;
        email?: string | undefined;
      })[] | undefined;
      main?: string | undefined;
      browser?: string | Record<string, string | boolean> | undefined;
      man?: string | string[] | undefined;
      directories?: Record<string, string> | undefined;
      bundleDependencies?: boolean | string[] | undefined;
      bundledDependencies?: boolean | string[] | undefined;
      optionalDependencies?: Record<string, string> | undefined;
      overrides?: Record<string, unknown> | undefined;
      os?: string[] | undefined;
      cpu?: string[] | undefined;
      private?: boolean | undefined;
      publishConfig?: Record<string, unknown> | undefined;
      workspaces?: string[] | undefined;
      deprecated?: string | undefined;
      types?: string | undefined;
      typings?: string | undefined;
      typesVersions?: Record<string, Record<string, string[]>> | undefined;
      sideEffects?: boolean | string[] | undefined;
      imports?: Record<string, unknown> | undefined;
      exports?: string | string[] | Record<string, unknown> | null | undefined;
    } & {
      [k: string]: unknown;
    };
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
  blockPnpmDedupe: bingo_stratum26.BlockWithoutAddons<{
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
  blockPrettier: bingo_stratum26.BlockWithAddons<{
    overrides: {
      options: {
        parser: string;
      };
      files: string;
    }[];
    plugins: string[];
    ignores: string[];
    runBefore: string[];
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
  blockPrettierPluginCurly: bingo_stratum26.BlockWithoutAddons<{
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
  blockPrettierPluginPackageJson: bingo_stratum26.BlockWithoutAddons<{
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
  blockPrettierPluginSentencesPerLine: bingo_stratum26.BlockWithoutAddons<{
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
  blockPrettierPluginSh: bingo_stratum26.BlockWithoutAddons<{
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
  blockREADME: bingo_stratum26.BlockWithAddons<{
    sections: string[];
    badges: {
      alt: string;
      src: string;
      href?: string | undefined;
      comments?: {
        after: string;
        before: string;
      } | undefined;
    }[];
    defaultUsage: string[];
    notices: string[];
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
  blockReleaseIt: bingo_stratum26.BlockWithAddons<{
    builders: {
      run: string;
      order: number;
    }[];
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
  blockRenovate: bingo_stratum26.BlockWithAddons<{
    ignoreDeps: string[];
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
  blockSecurityDocs: bingo_stratum26.BlockWithoutAddons<{
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
  blockTemplatedWith: bingo_stratum26.BlockWithoutAddons<{
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
  blockTSDown: bingo_stratum26.BlockWithAddons<{
    properties: Record<string, unknown>;
    entry: string[];
    runInCI: string[];
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
  blockTypeScript: bingo_stratum26.BlockWithAddons<{
    compilerOptions?: {
      allowArbitraryExtensions?: boolean | undefined;
      allowImportingTsExtensions?: boolean | undefined;
      allowJs?: boolean | undefined;
      allowSyntheticDefaultImports?: boolean | undefined;
      allowUmdGlobalAccess?: boolean | undefined;
      allowUnreachableCode?: boolean | undefined;
      allowUnusedLabels?: boolean | undefined;
      alwaysStrict?: boolean | undefined;
      baseUrl?: string | undefined;
      charset?: string | undefined;
      checkJs?: boolean | undefined;
      customConditions?: string[] | undefined;
      declaration?: boolean | undefined;
      declarationDir?: string | undefined;
      declarationMap?: boolean | undefined;
      disableReferencedProjectLoad?: boolean | undefined;
      disableSizeLimit?: boolean | undefined;
      disableSolutionSearching?: boolean | undefined;
      disableSourceOfProjectReferenceRedirect?: boolean | undefined;
      downlevelIteration?: boolean | undefined;
      emitBOM?: boolean | undefined;
      emitDeclarationOnly?: boolean | undefined;
      emitDecoratorMetadata?: boolean | undefined;
      erasableSyntaxOnly?: boolean | undefined;
      esModuleInterop?: boolean | undefined;
      exactOptionalPropertyTypes?: boolean | undefined;
      experimentalDecorators?: boolean | undefined;
      forceConsistentCasingInFileNames?: boolean | undefined;
      ignoreDeprecations?: string | undefined;
      importHelpers?: boolean | undefined;
      importsNotUsedAsValues?: "error" | "preserve" | "remove" | undefined;
      inlineSourceMap?: boolean | undefined;
      inlineSources?: boolean | undefined;
      isolatedDeclarations?: boolean | undefined;
      isolatedModules?: boolean | undefined;
      jsx?: "preserve" | "none" | "react" | "react-jsx" | "react-jsxdev" | "react-native" | undefined;
      keyofStringsOnly?: boolean | undefined;
      lib?: string[] | undefined;
      libReplacement?: boolean | undefined;
      locale?: string | undefined;
      mapRoot?: string | undefined;
      maxNodeModuleJsDepth?: number | undefined;
      module?: "preserve" | "none" | "amd" | "AMD" | "commonjs" | "CommonJS" | "es2015" | "ES2015" | "es2020" | "ES2020" | "es2022" | "ES2022" | "es6" | "ES6" | "esnext" | "ESNext" | "node16" | "Node16" | "node18" | "Node18" | "nodenext" | "NodeNext" | "None" | "Preserve" | "system" | "System" | "umd" | "UMD" | undefined;
      moduleDetection?: "auto" | "force" | "legacy" | undefined;
      moduleResolution?: "node16" | "Node16" | "nodenext" | "NodeNext" | "bundler" | "Bundler" | "classic" | "Classic" | "node" | "Node" | "node10" | "Node10" | "NodeJs" | undefined;
      moduleSuffixes?: string[] | undefined;
      newLine?: "crlf" | "lf" | undefined;
      noCheck?: boolean | undefined;
      noEmit?: boolean | undefined;
      noEmitHelpers?: boolean | undefined;
      noEmitOnError?: boolean | undefined;
      noErrorTruncation?: boolean | undefined;
      noFallthroughCasesInSwitch?: boolean | undefined;
      noImplicitAny?: boolean | undefined;
      noImplicitReturns?: boolean | undefined;
      noImplicitThis?: boolean | undefined;
      noStrictGenericChecks?: boolean | undefined;
      noUnusedLocals?: boolean | undefined;
      noUnusedParameters?: boolean | undefined;
      assumeChangesOnlyAffectDirectDependencies?: boolean | undefined;
      noImplicitUseStrict?: boolean | undefined;
      noLib?: boolean | undefined;
      noPropertyAccessFromIndexSignature?: boolean | undefined;
      noResolve?: boolean | undefined;
      noUncheckedIndexedAccess?: boolean | undefined;
      noImplicitOverride?: boolean | undefined;
      out?: string | undefined;
      outDir?: string | undefined;
      outFile?: string | undefined;
      paths?: Record<string, string> | undefined;
      preserveConstEnums?: boolean | undefined;
      preserveSymlinks?: boolean | undefined;
      composite?: boolean | undefined;
      incremental?: boolean | undefined;
      jsxFactory?: string | undefined;
      jsxFragmentFactory?: string | undefined;
      jsxImportSource?: string | undefined;
      preserveValueImports?: boolean | undefined;
      project?: string | undefined;
      reactNamespace?: string | undefined;
      removeComments?: boolean | undefined;
      resolvePackageJsonExports?: boolean | undefined;
      resolvePackageJsonImports?: boolean | undefined;
      rewriteRelativeImportExtensions?: boolean | undefined;
      rootDir?: string | undefined;
      rootDirs?: string[] | undefined;
      skipDefaultLibCheck?: boolean | undefined;
      skipLibCheck?: boolean | undefined;
      sourceMap?: boolean | undefined;
      sourceRoot?: string | undefined;
      strict?: boolean | undefined;
      strictBindCallApply?: boolean | undefined;
      strictBuiltinIteratorReturn?: boolean | undefined;
      strictFunctionTypes?: boolean | undefined;
      strictNullChecks?: boolean | undefined;
      strictPropertyInitialization?: boolean | undefined;
      stripInternal?: boolean | undefined;
      tsBuildInfoFile?: string | undefined;
      suppressExcessPropertyErrors?: boolean | undefined;
      noUncheckedSideEffectImports?: boolean | undefined;
      resolveJsonModule?: boolean | undefined;
      suppressImplicitAnyIndexErrors?: boolean | undefined;
      target?: "es2015" | "ES2015" | "es2020" | "ES2020" | "es2022" | "ES2022" | "esnext" | "ESNext" | "es2016" | "ES2016" | "es2017" | "ES2017" | "es2018" | "ES2018" | "es2019" | "ES2019" | "es2021" | "ES2021" | "es2023" | "ES2023" | "es2024" | "ES2024" | "es3" | "ES3" | "es5" | "ES5" | "json" | "JSON" | "latest" | "Latest" | undefined;
      traceResolution?: boolean | undefined;
      typeRoots?: string[] | undefined;
      types?: string[] | undefined;
      useDefineForClassFields?: boolean | undefined;
      useUnknownInCatchVariables?: boolean | undefined;
      verbatimModuleSyntax?: boolean | undefined;
    } | undefined;
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
  blockVitest: bingo_stratum26.BlockWithAddons<{
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
  blockVSCode: bingo_stratum26.BlockWithAddons<{
    settings: Record<string, unknown>;
    extensions?: string[] | undefined;
    debuggers?: (Record<string, unknown> & {
      name: string;
    })[] | undefined;
    tasks?: ({
      detail: string;
    } & Record<string, unknown>)[] | undefined;
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
  blockWebExt: bingo_stratum26.BlockWithoutAddons<{
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
};
//#endregion
export { blockAllContributors, blockAreTheTypesWrong, blockCSpell, blockCTATransitions, blockCodecov, blockContributingDocs, blockContributorCovenant, blockDevelopmentDocs, blockESLint, blockESLintComments, blockESLintJSDoc, blockESLintJSONC, blockESLintMarkdown, blockESLintMoreStyling, blockESLintNode, blockESLintPackageJson, blockESLintPerfectionist, blockESLintPlugin, blockESLintRegexp, blockESLintYML, blockFunding, blockGitHubActionsCI, blockGitHubIssueTemplates, blockGitHubPRTemplate, blockGitignore, blockKnip, blockMITLicense, blockMain, blockNcc, blockNvmrc, blockOctoGuide, blockOctoGuideStrict, blockPackageJson, blockPnpmDedupe, blockPrettier, blockPrettierPluginCurly, blockPrettierPluginPackageJson, blockPrettierPluginSentencesPerLine, blockPrettierPluginSh, blockREADME, blockReleaseIt, blockRenovate, blockSecurityDocs, blockTSDown, blockTemplatedWith, blockTypeScript, blockVSCode, blockVitest, blockWebExt, blocks };
//# sourceMappingURL=index.d.ts.map