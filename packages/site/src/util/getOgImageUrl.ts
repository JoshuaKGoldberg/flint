import type { GetStaticPathsOptions } from "astro";

import { getStaticPaths } from "../pages/og/[...path]";

const routes = await getStaticPaths({} as GetStaticPathsOptions);

const paths = new Set(routes.map(({ params }) => params.path));

export function getOgImageUrl(path: string): string | undefined {
	const normalizedPath = path.replace(/^\//, "").replace(/\/$/, "");

	if (paths.has(normalizedPath)) {
		return `/og/${normalizedPath}.png`;
	}
}
