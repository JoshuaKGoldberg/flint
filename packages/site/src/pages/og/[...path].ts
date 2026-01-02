import { OGImageRoute } from "astro-og-canvas";
import { type CollectionEntry, getCollection } from "astro:content";

const paths = await getCollection("docs");
const pages = Object.fromEntries(
	paths.map(({ data, id }) => {
		return [id, { data }] as [string, Pick<CollectionEntry<"docs">, "data">];
	}),
);

export const { GET, getStaticPaths } = OGImageRoute({
	getImageOptions: (_, { data }) => ({
		bgGradient: [
			[31, 42, 28],
			[31, 42, 28],
		],
		description: data.description,
		logo: {
			path: "./public/logo.png",
			size: [100],
		},
		padding: 80,
		title: data.title,
	}),

	pages,

	param: "path",
});
