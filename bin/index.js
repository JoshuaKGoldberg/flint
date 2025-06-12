#!/usr/bin/env node
import { runCli } from "../lib/cli/runCli.js";

process.exitCode = await runCli(process.argv.slice(2));
