import { styleText } from "node:util";

import { Presenter } from "../types/presenters.js";
import { plainPresenter } from "./plain.js";

export function createWatchPresenter(): Presenter {
	let startTime = Date.now();

	function logStartTime() {
		console.log(
			styleText(
				"gray",
				`Running in watch mode with (start time: ${startTime})...`,
			),
		);
	}

	return {
		begin() {
			startTime = Date.now();
			logStartTime();
		},
		end(configResults, formattingResults) {
			console.clear();
			logStartTime();
			plainPresenter.end(configResults, formattingResults);
		},
	};
}
