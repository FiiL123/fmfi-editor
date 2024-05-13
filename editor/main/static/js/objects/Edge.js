import { createGeometry, createSidebar } from "./Helper.js";

export default class Edge {
	constructor(attributes) {
		this.color = "black";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		const v1Pos = vertices.get(this.attributes.get("first-vertex-id"));
		const v2Pos = vertices.get(this.attributes.get("second-vertex-id"));
		if (v1Pos && v2Pos) {
			this.points = [v1Pos.x, v1Pos.y, v2Pos.x, v2Pos.y];
			this.geometry = createGeometry(this, "line", this.points, "black");
			graphLayer.add(this.geometry);
		} else {
			lateEdges.push(this);
		}
	}
	updateSidebar() {
		createSidebar(this);
	}

	createEdge() {
		const v1Pos = vertices.get(this.attributes.get("first-vertex-id"));
		const v2Pos = vertices.get(this.attributes.get("second-vertex-id"));
		if (v1Pos && v2Pos) {
			this.points = [v1Pos.x, v1Pos.y, v2Pos.x, v2Pos.y];
			this.geometry = createGeometry(this, "line", this.points, "black");
			graphLayer.add(this.geometry);
		}
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
