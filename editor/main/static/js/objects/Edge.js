import { createGeometry, createSidebar } from "./Helper.js";

export default class Edge {
	constructor(attributes, layer) {
		this.color = "black";
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		if (!this.createEdge()) {
			lateEdges.push(this);
		}
	}
	updateSidebar() {
		createSidebar(this);
	}

	createEdge() {
		const v1 = vertices.get(this.attributes.get("first-vertex-id"));
		const v2 = vertices.get(this.attributes.get("second-vertex-id"));
		if (v1 && v2) {
			v1.edges.push(this);
			v2.edges.push(this);
			this.points = [
				v1.getPoints().x,
				v1.getPoints().y,
				v2.getPoints().x,
				v2.getPoints().y,
			];
			this.geometry = createGeometry(this, "line", this.points, "black");
			this.layer.add(this.geometry);
			return true;
		}
		return false;
	}

	updateEdgePosition() {
		const v1 = vertices.get(this.attributes.get("first-vertex-id"));
		const v2 = vertices.get(this.attributes.get("second-vertex-id"));
		this.points = [
			v1.getPoints().x,
			v1.getPoints().y,
			v2.getPoints().x,
			v2.getPoints().y,
		];
		this.geometry.points(this.points);
	}

	toXML(doc, parent) {
		const edgeElem = doc.createElement("edge");
		this.attributes.forEach((val, key) => {
			edgeElem.setAttribute(key, val);
		});
		parent.appendChild(edgeElem);
	}
}

export function addEdge(attributes, layer) {
	const edge = new Edge(attributes, layer);
	objects.push(edge);
	return edge;
}
