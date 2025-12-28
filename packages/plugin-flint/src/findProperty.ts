import * as ts from "typescript";

export function findProperty<Node extends ts.Node>(
	properties: ts.NodeArray<ts.ObjectLiteralElementLike>,
	name: string,
	predicate: (node: ts.Node) => node is Node,
) {
	return properties.find(
		(property): property is ts.PropertyAssignment & { initializer: Node } =>
			ts.isPropertyAssignment(property) &&
			ts.isIdentifier(property.name) &&
			property.name.text === name &&
			predicate(property.initializer),
	)?.initializer;
}
