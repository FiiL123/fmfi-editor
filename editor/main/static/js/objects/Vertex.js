export default class Vertex {
	constructor(attributes) {
		this.color = "black";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
	}

	toXML(doc, parent) {
		const vertexElem = doc.createElement("vertex");
		this.attributes.forEach((val, key) => {
			vertexElem.setAttribute(key, val);
		});
		parent.appendChild(vertexElem);
	}
}

export function addVertex(attributes) {
	const vertex = new Vertex(attributes);
	objects.push(vertex);
	return vertex;
}
