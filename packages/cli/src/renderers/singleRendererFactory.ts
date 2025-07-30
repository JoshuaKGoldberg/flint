import * as fs from "node:fs/promises";

import { RendererFactory } from "./types.js";

export const singleRendererFactory: RendererFactory = {
	about: {
		name: "single",
	},
	initialize(presenter) {
		return {
			announce() {
				if (presenter.header) {
					console.log(presenter.header);
				}
			},
			async render({ runConfigResults: configResults, formattingResults }) {
				for (const [filePath, fileResults] of configResults.filesResults) {
					if (!fileResults.reports.length) {
						continue;
					}

					const sourceFileText = await fs.readFile(filePath, "utf-8");

					const body = presenter.renderFile({
						file: {
							filePath,
							text: sourceFileText,
						},
						reports: fileResults.reports,
					});

					for (const line of await Array.fromAsync(body)) {
						process.stdout.write(line);
					}
				}

				const summary = presenter.summarize({
					runConfigResults: configResults,
					formattingResults,
				});

				for (const line of await Array.fromAsync(summary)) {
					process.stdout.write(line);
				}
			},
		};
	},
};
