import { OptionsValues } from "../options.js";
import { getPresenterFactory } from "../presenters/getPresenterFactory.js";
import { interactiveRendererFactory } from "./interactive/interactiveRendererFactory.js";
import { singleRendererFactory } from "./singleRendererFactory.js";

export function createRendererFactory(
	configFileName: string,
	values: OptionsValues,
) {
	const presenterFactory = getPresenterFactory(values);
	const rendererFactory = values.interactive
		? interactiveRendererFactory
		: singleRendererFactory;

	return () =>
		rendererFactory.initialize(
			presenterFactory.initialize({
				configFileName,
				ignoreCache: !!values["cache-ignore"],
				runMode: values.watch ? "watch" : "single-run",
			}),
		);
}
