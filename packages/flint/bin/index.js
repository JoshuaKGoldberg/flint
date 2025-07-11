#!/usr/bin/env node
import { runCli } from "@flint/cli";

process.exitCode = await runCli(process.argv.slice(2));
