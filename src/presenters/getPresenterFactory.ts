import { OptionsValues } from "../cli/options.js";
import { PresenterFactory } from "../types/presenters.js";
import { briefPresenterFactory } from "./briefPresenterFactory.js";
import { detailedPresenterFactory } from "./detailed/detailedPresenterFactory.js";

export function getPresenterFactory(
	values: Pick<OptionsValues, "interactive" | "presenter">,
): PresenterFactory {
	const presenterName =
		values.presenter ?? (values.interactive ? "detailed" : "brief");

	switch (presenterName) {
		case "brief":
			return briefPresenterFactory;
		case "detailed":
			return detailedPresenterFactory;
		default:
			throw new Error(`Unknown --presenter: ${presenterName}`);
	}
}
