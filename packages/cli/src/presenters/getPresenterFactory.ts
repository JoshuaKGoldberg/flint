import type { OptionsValues } from "../options.js";
import { briefPresenterFactory } from "./briefPresenterFactory.js";
import { detailedPresenterFactory } from "./detailed/detailedPresenterFactory.js";
import type { PresenterFactory } from "./types.js";

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
