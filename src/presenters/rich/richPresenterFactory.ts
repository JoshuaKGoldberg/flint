import { PresenterFactory } from "../../types/presenters.js";
import { createRichReport } from "./createRichReport.js";

export const richPresenterFactory: PresenterFactory = {
	about: {
		name: "rich",
	},
	initialize({ configFileName }) {
		console.log("This is the one.");
		return {
			header: `Commencing rich lint presentation with ${configFileName}...!`,
			runtime: {
				async *renderFile({ file, reports }) {
					console.log("...and...");
					for (const report of reports) {
						const reported = await createRichReport(report, file.text);
						console.log({ reported });
						yield reported;
					}
				},
				*summarize() {
					//...
				},
			},
		};
	},
};
