import {
	data,
	type FlintRulePluginReference,
	type FlintRuleReference,
	type Linter,
	type Rule,
} from "@flint.fyi/comparisons" with { type: "json" };

import styles from "./RulesTable.module.css";

function getSortKey(rule: Rule) {
	return [
		rule.flint.plugin.name,
		rule.flint.preset,
		rule.flint.strictness,
		rule.flint.name,
	]
		.join("-")
		.replace("Not implemented", "Z-Not-implemented");
}

function renderFlintPreset(flint: Rule["flint"]) {
	return flint.strictness
		? `${flint.preset} (${flint.strictness})`
		: flint.preset;
}

function renderLinks(linter: Linter, rule: Rule) {
	if (!rule[linter]) {
		return undefined;
	}

	return rule[linter].map((reference) => (
		<a
			data-wat={JSON.stringify(reference)}
			href={reference.url}
			key={reference.name}
			target="_blank"
		>
			<code>{reference.name}</code>
		</a>
	));
}

export interface RulesTableProps {
	implementing: boolean;
}

function renderFlintName(flint: FlintRuleReference) {
	return flint.implemented ? (
		<a href={`/rules/${flint.plugin.code}/${flint.name.toLowerCase()}`}>
			{flint.name}
		</a>
	) : (
		flint.name
	);
}

function renderImplemented(values: Rule[]) {
	const count = values.filter((value) => value.flint.implemented).length;

	return (
		<>
			Implemented: {count} of {values.length} (
			{Math.trunc((count / values.length) * 1000) / 10}%)
		</>
	);
}

export function RulesTable({ implementing }: RulesTableProps) {
	const values = Object.values(data)
		.filter(
			(rule) => (rule.flint.preset !== "Not implementing") === implementing,
		)
		.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));

	return (
		<div>
			<blockquote>
				{implementing ? (
					renderImplemented(values)
				) : (
					<>Total count: {values.length}</>
				)}
			</blockquote>
			<table className={styles.rulesTable}>
				<thead>
					<th>Flint Name</th>
					<th>Plugin</th>
					{implementing && <th>Preset</th>}
					<th>Biome Rule(s)</th>
					<th>Deno Lint Rule(s)</th>
					<th>ESLint Rule(s)</th>
					<th>Oxlint Rule(s)</th>
					{!implementing && <th>Notes</th>}
				</thead>
				<tbody>
					{values.map((rule) => (
						<tr key={rule.flint.name}>
							<td>
								<code>{renderFlintName(rule.flint)}</code>
							</td>
							<td> {rule.flint.plugin.name}</td>
							{implementing && <td>{renderFlintPreset(rule.flint)}</td>}
							<td>{renderLinks("biome", rule)}</td>
							<td>{renderLinks("deno", rule)}</td>
							<td>{renderLinks("eslint", rule)}</td>
							<td>{renderLinks("oxlint", rule)}</td>
							{!implementing && <td>{rule.notes}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
