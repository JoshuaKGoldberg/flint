import cliCursor from "cli-cursor";
import readline from "node:readline";

import { RendererContext, RendererFactory } from "../types.js";
import { createListeners } from "./createListeners.js";
import { createState } from "./createState.js";
import { printAllClear } from "./printAllClear.js";
import { printControls } from "./printControls.js";
import { printFile } from "./printFile.js";
import { printHeader } from "./printHeader.js";
import { printSummary } from "./printSummary.js";

export const interactiveRendererFactory: RendererFactory = {
	about: {
		name: "interactive",
	},
	initialize(presenter) {
		const onDisposeListeners = createListeners();
		const onQuitListeners = createListeners();
		const [getFile, setFile] = createState(0);

		cliCursor.hide();
		process.stdin.setRawMode(true);
		process.stdin.resume();
		readline.emitKeypressEvents(process.stdin);

		function announce() {
			console.clear();

			if (presenter.header) {
				console.log(presenter.header);
			}
		}

		function dispose() {
			cliCursor.show();
			onDisposeListeners.call();
			process.stdin.pause();
			process.stdin.setRawMode(false);
		}

		function quit() {
			console.log("Exiting interactive mode.");
			onQuitListeners.call();
		}

		async function render({ configResults }: RendererContext) {
			const filesWithReportResults = Array.from(
				configResults.filesResults,
			).filter(([, results]) => results.reports.length);

			const events: Record<string, (() => boolean) | undefined> = {
				left: () => setFile(Math.max(0, getFile() - 1)),
				right: () =>
					setFile(Math.min(filesWithReportResults.length - 1, getFile() + 1)),
			};

			await rerender();

			return new Promise<void>((resolve) => {
				let currentTask: Promise<void> | undefined;

				onDisposeListeners.add(offKeyPress);
				onQuitListeners.add(offKeyPress);
				process.stdin.on("keypress", onKeyPress);

				function offKeyPress() {
					process.stdin.off("keypress", onKeyPress);
				}

				function onKeyPress(chunk: string, key: { name: string }) {
					if (chunk === "\x03" || key.name === "q") {
						dispose();
						quit();
						resolve();
						return;
					}

					if (events[key.name]?.()) {
						queueRerender();
					}

					return;
				}

				function queueRerender() {
					if (currentTask) {
						currentTask = currentTask.then(() => rerender());
					} else {
						currentTask = rerender();
					}
				}
			});

			async function rerender() {
				console.clear();
				announce();

				if (!filesWithReportResults.length) {
					console.log(printAllClear());
					return;
				}

				const [filePath, fileResults] = filesWithReportResults[getFile()];

				console.log(
					[
						printHeader(getFile(), filesWithReportResults.length),
						printControls(getFile(), filesWithReportResults.length),
						"",
						await printFile(filePath, presenter, fileResults.reports),
						"",
						printSummary(filesWithReportResults),
					].join("\n"),
				);
			}
		}

		return {
			announce,
			dispose,
			onQuit(callback) {
				onQuitListeners.add(callback);
			},
			render,
		};
	},
};
