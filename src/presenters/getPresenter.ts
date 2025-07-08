import { CorePresenterName, Presenter } from "../types/presenters.js";
import { briefPresenter } from "./briefPresenterFactory.js";
import { detailedPresenter } from "./detailed/detailedPresenter.js";

export function getPresenter(
	presenterName: CorePresenterName | undefined,
): Presenter {
	// TODO: once --interactive mode exists, default to "detailed" if it's on
	presenterName ??= "brief";

	switch (presenterName) {
		case "brief":
			return briefPresenter;
		case "detailed":
			return detailedPresenter;
		default:
			throw new Error(`Unknown --presenter: ${presenterName}`);
	}
}
