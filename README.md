<h1 align="center">Flint</h1>

<p align="center">
	[Experimental] A fast, friendly linter.
	❤️‍🔥
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 4" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-4-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/flint/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/flint/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/flint" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/flint?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

<img align="right" alt="Cartoon campfire - caption: (experimental)" src="docs/flint.png">

**Flint** is an experimental new linter.
It's a proof-of-concept to explore the concepts in the following blog posts:

- [Hybrid Linters: The Best of Both Worlds](https://www.joshuakgoldberg.com/blog/hybrid-linters-the-best-of-both-worlds)
- [If I Wrote a Linter, Part 1: Architecture](https://www.joshuakgoldberg.com/blog/if-i-wrote-a-linter-part-1-architecture)
- [If I Wrote a Linter, Part 2: Developer Experience](https://www.joshuakgoldberg.com/blog/if-i-wrote-a-linter-part-2-developer-experience)
- [If I Wrote a Linter, Part 3: Ecosystem](https://www.joshuakgoldberg.com/blog/if-i-wrote-a-linter-part-3-ecosystem)
- [If I Wrote a Linter, Part 4: Summary](https://www.joshuakgoldberg.com/blog/if-i-wrote-a-linter-part-4-summary)

This project might go nowhere.
It might show some of those ideas to be wrong.
It might become a real linter.
Only time will tell.

In the meantime, come talk about it on the [Flint Discord](https://discord.gg/rdC2XPCmn5).

## Why?

Flint is an attempt at a "hybrid" linter: one that combines...

- **Ergonomics**: the ease of writing rules in JavaScript or TypeScript
- **Performance**: some of the speed of native linters by parsing and type checking with typescript-go

It also brings in several improvements over traditional linter paradigms:

- **Streamlined configuration**: flexible configuration files that still preserve readability
- **Type-aware caching**: significantly improving performance when linting changes to large repositories
- **Unified core**: promoting popular rules to the core project for easier, more reliable inclusion

## Usage

Coming soon.

![Terminal screenshot of a colored linter output. ~/repos/flint $ node bin/index.js      /Users/josh/repos/flint/src/example-lint-failures.ts   1:25  Consecutive non-null assertion operators are unnecessary.                    consecutiveNonNullAssertions   4:0   For-in loops over arrays have surprising behavior that often leads to bugs.  forInArrays  ✖ Found 2 reports across 1 file. ~/repos/flint $ ](https://github.com/user-attachments/assets/f703224e-916f-442e-aa7b-bc2a16b6ad72)

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! ❤️‍🔥

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ArnaudBarre"><img src="https://avatars.githubusercontent.com/u/14235743?v=4?s=100" width="100px;" alt="Arnaud Barré"/><br /><sub><b>Arnaud Barré</b></sub></a><br /><a href="#ideas-ArnaudBarre" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://donisaac.dev"><img src="https://avatars.githubusercontent.com/u/22823424?v=4?s=100" width="100px;" alt="Don Isaac"/><br /><sub><b>Don Isaac</b></sub></a><br /><a href="#maintenance-donisaac" title="Maintenance">🚧</a> <a href="https://github.com/JoshuaKGoldberg/flint/commits?author=donisaac" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/flint/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/flint/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/flint/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bmclear"><img src="https://avatars.githubusercontent.com/u/7715393?v=4?s=100" width="100px;" alt="bmclear"/><br /><sub><b>bmclear</b></sub></a><br /><a href="#maintenance-bmclear" title="Maintenance">🚧</a> <a href="https://github.com/JoshuaKGoldberg/flint/commits?author=bmclear" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo framework](https://create.bingo).
