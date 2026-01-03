import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const paths = await getCollection("docs");
const pages = Object.fromEntries(
	paths.map(({ data, id }) => {
		return [id, { data }] as const;
	}),
);

export const { GET, getStaticPaths } = OGImageRoute({
	getImageOptions: (_, { data }) => ({
		bgGradient: [
			[31, 42, 28],
			[31, 42, 28],
		],
		// https://github.com/delucis/astro-og-canvas/issues/115
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		description: data.description,
		logo: {
			path: "./public/logo.png",
			size: [100],
		},
		padding: 80,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		title: data.title,
	}),

	pages,

	param: "path",
});
