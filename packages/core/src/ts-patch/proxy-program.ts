import type { createProgram } from "typescript";

const globalTyped = globalThis as unknown as {
	createProgramProxies: Set<
		(
			ts: typeof import("typescript"),
			create: typeof createProgram,
		) => typeof createProgram
	>;
	extraSupportedExtensions: Set<string>;
};
// Since it's not possible to change the module graph evaluation order,
// we store proxies unordered
globalTyped.createProgramProxies ??= new Set();

globalTyped.extraSupportedExtensions ??= new Set();

export function getExtraSupportedExtensions() {
	return Array.from(globalTyped.extraSupportedExtensions);
}

export function setTSExtraSupportedExtensions(extensions: string[]) {
	for (const ext of extensions) {
		globalTyped.extraSupportedExtensions.add(ext);
	}
	return () => {
		for (const ext of extensions) {
			globalTyped.extraSupportedExtensions.delete(ext);
		}
	};
}

export function setTSProgramCreationProxy(
	proxy: (
		ts: typeof import("typescript"),
		create: typeof createProgram,
	) => typeof createProgram,
) {
	globalTyped.createProgramProxies.add(proxy);

	return () => globalTyped.createProgramProxies.delete(proxy);
}

// TODO: explanation
export function proxyCreateProgram(
	ts: typeof import("typescript"),
	original: typeof createProgram,
) {
	let proxied = original;
	for (const proxy of globalTyped.createProgramProxies) {
		proxied = proxy(ts, proxied);
	}
	return proxied;
}
