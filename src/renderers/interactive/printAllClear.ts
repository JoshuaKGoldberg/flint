import { styleText } from "node:util";

export function printAllClear() {
	return styleText("green", "No lint reports. Yay!");
}
