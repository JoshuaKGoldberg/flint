import type * as yaml from "yaml-unist-parser";

export type YmlNodesByName = {
	[Node in yaml.YamlUnistNode as Node["type"]]: Node;
};
