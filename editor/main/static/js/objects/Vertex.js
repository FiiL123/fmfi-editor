import { createGeometry, createSidebar } from "./Helper.js";

export default class Vertex {
	constructor(attributes) {
		this.color = "red";
		this.attributes = attributes;
		this.edges = [];
		this.id = attributes.has("id") ? attributes.get("id") : "";
		const points = {
			x: parseInt(this.attributes.get("x")),
			y: parseInt(this.attributes.get("y")),
		};
		vertices.set(attributes.get("id"), this);
		this.geometry = createGeometry(this, "circle", points, this.color);
		graphLayer.add(this.geometry);
	}

	updateSidebar() {
		createSidebar(this);
	}

	getPoints() {
		const points = {
			x: parseInt(this.attributes.get("x")),
			y: parseInt(this.attributes.get("y")),
		};
		return points;
	}

	updatePosition() {
		this.attributes.set("x", this.geometry.x());
		this.attributes.set("y", this.geometry.y());
		vertices.set(this.attributes.get("id"), this);
		for (const edge of this.edges) {
			edge.updateEdgePosition();
		}
	}

	toXML(doc, parent) {
		const vertexElem = doc.createElement("vertex");
		this.attributes.forEach((val, key) => {
			vertexElem.setAttribute(key, val);
		});
		parent.appendChild(vertexElem);
	}

	delete() {
		this.geometry.remove();
		for (const edge of this.edges) {
			edge.geometry.remove();
		}
	}

	ressurect() {
		for (const edge of this.edges) {
			graphLayer.add(edge.geometry);
		}
		graphLayer.add(this.geometry);
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	lockDragging() {
		this.geometry.draggable(false);
	}
}

export function addVertex(attributes) {
	const vertex = new Vertex(attributes);
	objects.push(vertex);
	return vertex;
}
