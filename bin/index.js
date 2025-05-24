#!/usr/bin/env node
import { runCli } from "../lib/cli/runCli.js";

const { code, message } = await runCli();

if (code) {
	process.exitCode = code;
	console.error(message);
} else {
	console.log("✅");
}
