export interface PluginCardData {
	colors: PluginLogoColors;
	description: string;
	id: string;
	name: string;
}

export interface PluginLogoColors {
	flame: string;
	heart: string;
	squiggly: string;
}

export const pluginCardDataById: Record<
	string,
	Record<string, PluginCardData>
> = {
	core: {
		json: {
			colors: {
				flame: "#636363",
				heart: "#FAF0E6",
				squiggly: "#000080",
			},
			description:
				"Rules for linting `.json` files containing arbitrary data in the JavaScript Object Notation (JSON) format.",
			id: "json",
			name: "JSON",
		},
		md: {
			colors: {
				flame: "#ffffff",
				heart: "#2BA4E0",
				squiggly: "#343A40",
			},
			description:
				"Rules for linting `.md` files containing Markdown, the lightweight markup language.",
			id: "markdown",
			name: "Markdown",
		},
		packageJson: {
			colors: {
				flame: "#F98717",
				heart: "#DF2AFC",
				squiggly: "#333333",
			},
			description:
				"Rules for linting Node.js `package.json` manifest files in repositories and workspaces.",
			id: "packageJson",
			name: "PackageJSON",
		},
		ts: {
			colors: {
				flame: "#2D78C7",
				heart: "#FFFFFF",
				squiggly: "#235A97",
			},
			description:
				"Rules for linting JavaScript and TypeScript code, including the latest and greatest powerful typed linting rules.",
			id: "ts",
			name: "TypeScript (and JavaScript)",
		},
		yaml: {
			colors: {
				flame: "#CC1718",
				heart: "#40e0d0",
				squiggly: "#008000",
			},
			description:
				"Rules for linting `.yaml`/`.yml` files containing arbitrary data in the Yet Another Markup Language (YAML) format.",
			id: "yaml",
			name: "YAML",
		},
	},
	focused: {
		browser: {
			colors: {
				flame: "#E85D0D",
				heart: "#2CA6E0",
				squiggly: "#031E4C",
			},
			description:
				"Rules for code that runs in browsers and other environments with DOM (Document Object Model) elements.",
			id: "browser",
			name: "Browser",
		},
		cspell: {
			colors: {
				flame: "#B51A00",
				heart: "#F5EC02",
				squiggly: "#010100",
			},
			description:
				'Rules that detect misspelling typos in source files using the general-purpose code-optimized "CSpell" spell-checker.',
			id: "cspell",
			name: "CSpell",
		},
		flint: {
			colors: {
				flame: "#F2BF80",
				heart: "#AB1B1B",
				squiggly: "#886035",
			},
			description:
				"Rules for writing third-party Flint plugins and custom rules. Meta!",
			id: "flint",
			name: "Flint",
		},
		jsx: {
			colors: {
				flame: "#61DBFB",
				heart: "#F3DF49",
				squiggly: "#1F80A3",
			},
			description:
				'Rules for code that describes UI with the "JSX" markup language, commonly in `.jsx` and/or `.tsx` files.',
			id: "jsx",
			name: "JSX",
		},
		node: {
			colors: {
				flame: "#3C873A",
				heart: "#6BC045",
				squiggly: "#303030",
			},
			description:
				"Rules for code that runs in Node.js and other server runtimes that include Node.js-like APIs.",
			id: "node",
			name: "Node.js",
		},
		performance: {
			colors: {
				flame: "#fadd03ff",
				heart: "#fff2eeff",
				squiggly: "#F05756",
			},
			description:
				'Rules for specialized code designed specifically to be run in performance-critical "hot paths".',
			id: "performance",
			name: "Performance",
		},
		sorting: {
			colors: {
				flame: "#4B32C3",
				heart: "#FFFFFF",
				squiggly: "#232327",
			},
			description:
				"Rules that automatically sort any and all possible aspects of code alphabetically, such as imports and properties.",
			id: "sorting",
			name: "Sorting",
		},
	},
};

export function getPluginById(pluginId: string) {
	for (const group of Object.keys(pluginCardDataById)) {
		if (pluginId in pluginCardDataById[group]) {
			return { group, plugin: pluginCardDataById[group][pluginId] };
		}
	}

	throw new Error(`Unknown pluginId: ${pluginId}`);
}
