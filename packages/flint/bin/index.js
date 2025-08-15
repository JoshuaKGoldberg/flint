#!/usr/bin/env node
import { runCli } from "@flint.fyi/cli";
import { enableCompileCache } from "node:module";

enableCompileCache();

process.exitCode = await runCli(process.argv.slice(2));
