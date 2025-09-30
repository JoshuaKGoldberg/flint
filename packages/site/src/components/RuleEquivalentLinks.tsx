import type { Linter, Comparison } from "@flint.fyi/comparisons";

export interface RuleEquivalentLinksProps {
	comparison: Comparison;
	linter: Linter;
}

export function RuleEquivalentLinks({
	comparison,
	linter,
}: RuleEquivalentLinksProps) {
	return comparison[linter]?.map((reference) => (
		<a href={reference.url} key={reference.name} target="_blank">
			<code>{reference.name}</code>
		</a>
	));
}
