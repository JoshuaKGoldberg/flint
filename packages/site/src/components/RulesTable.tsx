import {
	comparisons,
	type FlintRuleReference,
	type Comparison,
	type Linter,
	linterNames,
} from "@flint.fyi/comparisons" with { type: "json" };
import clsx from "clsx";

import styles from "./RulesTable.module.css";
import { RuleEquivalentLinks } from "./RuleEquivalentLinks";

const pluginNames: Record<string, string> = {
	browser: "browser",
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

function getSortKey(rule: Comparison) {
	return [
		rule.flint.plugin,
		rule.flint.preset,
		rule.flint.strictness,
		rule.flint.name,
	]
		.join("-")
		.replace("Not implemented", "Z-Not-implemented");
}

function renderFlintPreset(flint: Comparison["flint"]) {
	return flint.strictness
		? `${flint.preset} (${flint.strictness})`
		: flint.preset;
}

export interface RulesTableProps {
	implementing: boolean;
	plugin?: string;
	small?: boolean;
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

function renderImplemented(values: Comparison[]) {
	const count = values.filter((value) => value.flint.implemented).length;

	return (
		<>
			Implemented: {count} of {values.length} (
			{Math.trunc((count / values.length) * 1000) / 10}%)
		</>
	);
}

export function RulesTable({ implementing, plugin, small }: RulesTableProps) {
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
		.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));

	const rulesClassName = plugin
		? styles.rulesWithoutPlugin
		: styles.rulesWithPlugin;

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
					<th>Flint Name</th>
					{!plugin && <th>Plugin</th>}
					{implementing && <th>Preset</th>}
					<th>Biome Rule(s)</th>
					<th>Deno Lint Rule(s)</th>
					<th>ESLint Rule(s)</th>
					<th>Oxlint Rule(s)</th>
					{!implementing && <th>Notes</th>}
				</thead>
				<tbody>
					{values.map((comparison) => (
						<tr key={comparison.flint.name}>
							<td>
								<code>{renderFlintName(comparison.flint)}</code>
							</td>
							{!plugin && <td>{pluginNames[comparison.flint.plugin]}</td>}
							{implementing && <td>{renderFlintPreset(comparison.flint)}</td>}
							{(Object.keys(linterNames) as Linter[]).map((linter) => (
								<td className={rulesClassName} key={linter}>
									{comparison[linter] && (
										<RuleEquivalentLinks
											comparison={comparison}
											linter={linter}
										/>
									)}
								</td>
							))}
							{!implementing && <td>{comparison.notes}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
