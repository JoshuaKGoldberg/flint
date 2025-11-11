import {
	comparisons,
	type FlintRuleReference,
	type Comparison,
} from "@flint.fyi/comparisons" with { type: "json" };
import clsx from "clsx";

import styles from "./RulesTable.module.css";
import { getRuleForPluginSafe } from "./getRuleForPlugin";

const pluginNames: Record<string, string> = {
	browser: "Browser",
	cspell: "CSpell",
	deno: "Deno",
	flint: "Flint",
	json: "JSON",
	jsx: "JSX",
	md: "Markdown",
	node: "Node",
	packageJson: "PackageJSON",
	performance: "Performance",
	sorting: "Sorting",
	ts: "TypeScript",
	yml: "YML",
};

function renderFlintPreset(flint: Comparison["flint"]) {
	const hrefBase = `/rules/${flint.plugin}#${flint.preset.toLowerCase()}`;
	const [href, text] = flint.strictness
		? [`${hrefBase}strict`, `${flint.preset} (${flint.strictness})`]
		: [hrefBase, flint.preset];

	return <a href={href}>{text}</a>;
}

export interface RulesTableProps {
	implementing: boolean;
	plugin?: string;
	small?: boolean;
	sortBy?: "name" | "preset";
}

function renderFlintName(flint: FlintRuleReference) {
	return flint.implemented ? (
		<a href={`/rules/${flint.plugin}/${flint.name.toLowerCase()}`}>
			{flint.name}
		</a>
	) : (
		flint.name
	);
}

function renderFlintRuleDescription(flint: FlintRuleReference) {
	return getRuleForPluginSafe(flint.plugin, flint.name)?.about.description;
}

function renderImplemented(values: Comparison[]) {
	const count = values.filter((value) => value.flint.implemented).length;

	return count === values.length ? null : (
		<>
			Implemented: {count} of {values.length} (
			{Math.trunc((count / values.length) * 1000) / 10}%)
		</>
	);
}

export function RulesTable({
	implementing,
	sortBy,
	plugin,
	small,
}: RulesTableProps) {
	const comparator: (a: Comparison, b: Comparison) => number =
		sortBy === "name"
			? (a, b) => a.flint.name.localeCompare(b.flint.name)
			: (a, b) =>
					a.flint.preset === b.flint.preset
						? a.flint.name.localeCompare(b.flint.name)
						: a.flint.preset.localeCompare(b.flint.preset);

	const values = comparisons
		.filter((comparison) => {
			if ((comparison.flint.preset !== "Not implementing") !== implementing) {
				return false;
			}

			if (plugin && comparison.flint.plugin !== plugin) {
				return false;
			}

			return true;
		})
		.sort(comparator);

	return (
		<div>
			<blockquote>
				{implementing ? (
					renderImplemented(values)
				) : (
					<>Total count: {values.length}</>
				)}
			</blockquote>
			<table
				className={clsx(
					styles.rulesTable,
					small ? styles.small : styles.normal,
				)}
			>
				<thead>
					<th>Flint Rule</th>
					{!plugin && <th>Plugin</th>}
					<th>{implementing ? "Preset" : "Notes"}</th>
				</thead>
				<tbody>
					{values.map((comparison) => (
						<tr key={comparison.flint.name}>
							<td>
								<code>{renderFlintName(comparison.flint)}</code>
								<small>{renderFlintRuleDescription(comparison.flint)}</small>
							</td>
							{!plugin && (
								<td>
									<a href={`/rules/${comparison.flint.plugin}`}>
										{pluginNames[comparison.flint.plugin]}
									</a>
								</td>
							)}
							<td>
								{implementing
									? renderFlintPreset(comparison.flint)
									: comparison.notes}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
