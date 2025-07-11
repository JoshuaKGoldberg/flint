#!/usr/bin/env node
import { runCli } from "@flint.fyi/cli";

process.exitCode = await runCli(process.argv.slice(2));
