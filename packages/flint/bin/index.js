#!/usr/bin/env node
// @ts-check
import { runCli } from "@flint.fyi/cli";
import { enableCompileCache } from "node:module";

enableCompileCache();

process.exitCode = await runCli(process.argv.slice(2));
