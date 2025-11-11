import type { PluginCardData } from "./pluginCardData";
import { PluginCard, type PluginCardProps } from "./PluginCard";
import styles from "./PluginCards.module.css";

export interface PluginCardsProps {
	plugins: PluginCardData[];
}

export function PluginCards({ plugins }: PluginCardsProps) {
	return (
		<ul className={styles.pluginCards}>
			{plugins.map((data) => (
				<PluginCard key={data.id} data={data} />
			))}
		</ul>
	);
}
