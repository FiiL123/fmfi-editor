import { createGeometry, createSidebar } from "./Helper.js";

export default class Vertex {
	constructor(attributes) {
		this.color = "red";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		const points = {
			x: parseInt(this.attributes.get("x")),
			y: parseInt(this.attributes.get("y")),
		};
		vertices.set(attributes.get("id"), points);
		this.geometry = createGeometry(this, "circle", points, this.color);
		graphLayer.add(this.geometry);
	}

	updateSidebar() {
		createSidebar(this);
	}

	updatePosition() {
		const points = {
			x: parseInt(this.attributes.get("x")),
			y: parseInt(this.attributes.get("y")),
		};
		vertices.set(this.attributes.get("id"), points);
		console.log(vertices);
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
