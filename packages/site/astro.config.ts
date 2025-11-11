import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { konamiEmojiBlast } from "@konami-emoji-blast/astro";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";

export default defineConfig({
	integrations: [
		konamiEmojiBlast(),
		starlight({
			components: {
				Footer: "src/components/Footer.astro",
				Head: "src/components/Head.astro",
			},
			customCss: ["src/styles.css"],
			favicon: "/logo.png",
			logo: {
				src: "src/assets/logo.png",
			},
			plugins: [
				starlightLinksValidator(),
				starlightSidebarTopics([
					{
						icon: "open-book",
						items: [
							{ label: "About Flint", link: "about" },
							{ label: "CLI", link: "cli" },
							{ label: "Configuration", link: "configuration" },
							{ label: "Glossary", link: "glossary" },
							{ label: "FAQs", link: "faqs" },
						],
						label: "About",
						link: "/about",
					},
					{
						icon: "list-format",
						id: "rules",
						items: [
							{
								items: [
									{ label: "JSON", link: "/rules/json" },
									{ label: "Markdown", link: "/rules/md" },
									{ label: "PackageJSON", link: "/rules/package-json" },
									{ label: "TypeScript", link: "/rules/ts" },
									{ label: "YML", link: "/rules/yml" },
								],
								label: "Core Plugins",
							},
							{
								items: [
									{ label: "Browser", link: "/rules/browser" },
									{ label: "CSpell", link: "/rules/cspell" },
									{ label: "Flint", link: "/rules/flint" },
									{ label: "JSX", link: "/rules/jsx" },
									{ label: "Node", link: "/rules/node" },
									{ label: "Performance", link: "/rules/performance" },
									{ label: "Sorting", link: "/rules/sorting" },
								],
								label: "Focused Plugins",
							},
						],
						label: "Rules",
						link: "/rules",
					},
				]),
			],
			social: [
				{
					href: "https://discord.gg/cFK3RAUDhy",
					icon: "discord",
					label: "Discord",
				},
				{
					href: "https://github.com/JoshuaKGoldberg/flint",
					icon: "github",
					label: "Github",
				},
			],
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			title: "Flint",
		}),
		react(),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
	site: "https://flint.fyi",
	// https://github.com/withastro/astro/issues/14117
	vite: {
		ssr: {
			noExternal: ["zod"],
		},
	},
});
