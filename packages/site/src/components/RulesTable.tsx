import {
	comparisons,
	type FlintRuleReference,
	type Comparison,
} from "@flint.fyi/comparisons" with { type: "json" };

import styles from "./RulesTable.module.css";
import { RuleEquivalentLinks } from "./RuleEquivalentLinks";

function getSortKey(rule: Comparison) {
	return [
		rule.flint.plugin.name,
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

function renderImplemented(values: Comparison[]) {
	const count = values.filter((value) => value.flint.implemented).length;

	return (
		<>
			Implemented: {count} of {values.length} (
			{Math.trunc((count / values.length) * 1000) / 10}%)
		</>
	);
}

export function RulesTable({ implementing }: RulesTableProps) {
	const values = comparisons
		.filter(
			(comparison) =>
				(comparison.flint.preset !== "Not implementing") === implementing,
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
							<RuleEquivalentLinks comparison={rule} linter="biome" />
							<RuleEquivalentLinks comparison={rule} linter="deno" />
							<RuleEquivalentLinks comparison={rule} linter="eslint" />
							<RuleEquivalentLinks comparison={rule} linter="oxlint" />
							{!implementing && <td>{rule.notes}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
