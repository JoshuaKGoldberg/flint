import { PresenterFactory } from "../types/presenters.js";
import { plainPresenterFactory } from "./plainPresenterFactory.js";
import { richPresenterFactory } from "./rich/richPresenterFactory.js";

export function getPresenterFactory(
	presenterName: string | undefined,
): PresenterFactory {
	// presenterName ??= "plain";
	presenterName ??= process.stdout.isTTY ? "rich" : "plain";

	switch (presenterName) {
		case "plain":
			return plainPresenterFactory;
		case "rich":
			return richPresenterFactory;
		default:
			throw new Error(`Unknown --presenter: ${presenterName}`);
	}
}
