export default class Edge {
	constructor(attributes) {
		this.color = "black";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
	}

	toXML(doc, parent) {
		const edgeElem = doc.createElement("edge");
		this.attributes.forEach((val, key) => {
			edgeElem.setAttribute(key, val);
		});
		parent.appendChild(edgeElem);
	}
}

export function addEdge(attributes) {
	const edge = new Edge(attributes);
	objects.push(edge);
	return edge;
}
