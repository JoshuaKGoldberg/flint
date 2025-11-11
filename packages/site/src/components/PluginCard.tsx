import markdownIt from "markdown-it";
import { ColoredLogo } from "./ColoredLogo";
import styles from "./PluginCard.module.css";
import type { PluginCardData } from "./pluginCardData";

export interface PluginCardProps {
	data: PluginCardData;
}

const renderer = markdownIt();

export function PluginCard({
	data: { colors, description, id, name },
}: PluginCardProps) {
	return (
		<li className={styles.pluginCard}>
			<ColoredLogo colors={colors} />
			<div className={styles.texts}>
				<span className={styles.name}>
					<a href={`/rules/${id}`}>{name}</a>{" "}
				</span>
				<span
					className={styles.description}
					dangerouslySetInnerHTML={{
						__html: renderer.renderInline(description),
					}}
				/>
			</div>
		</li>
	);
}
