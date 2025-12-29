import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { topicSchema } from "starlight-sidebar-topics/schema";

export const collections = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({ extend: topicSchema }),
	}),
};
