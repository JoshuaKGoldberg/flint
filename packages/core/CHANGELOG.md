# @flint/core

## 0.15.2

### Patch Changes

- 5bca9c4: fix(core): make `Rule` type assignable to `AnyRule`

## 0.15.1

### Patch Changes

- 3d19082: fix: use 0-indexed column and line across codebase

## 0.15.0

### Minor Changes

- 7d0d873: add // flint-\* comment directives
- 79f15da: add --skip-diagnostics CLI flag

### Patch Changes

- b48f4a9: ignore empty gitignore lines

## 0.14.0

### Minor Changes

- aa0bdcb: add --cache-ignore

### Patch Changes

- 0473d6c: move omit-empty dependency from root to core

## 0.13.5

### Patch Changes

- 0b80834: allow rules to indicate dependencies
- 63b61e5: add --suggestions to CLI
- Updated dependencies [63b61e5]
  - @flint.fyi/utils@0.13.2

## 0.13.4

### Patch Changes

- a4b07b1: remove TypeScript properties from RuleContext
- 3c3bcae: combine config exclude and globs into files
- ec4a4ff: allow rules to be async

## 0.13.3

### Patch Changes

- 3ef4331: fix type errors passing rules to defineConfig

## 0.13.2

### Patch Changes

- 4904678: allow omitting globs for createPlugin

## 0.13.1

### Patch Changes

- 9909b48: add README.md
- Updated dependencies [9909b48]
  - @flint.fyi/utils@0.13.1

## 0.13.0

### Minor Changes

- 72ed00b: feat: split into a monorepo

### Patch Changes

- Updated dependencies [72ed00b]
  - @flint/utils@0.13.0
