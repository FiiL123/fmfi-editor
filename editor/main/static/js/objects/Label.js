import { createSidebar } from "./Helper.js";
import Text from "./Geometry/Text.js";

export default class Label {
	constructor(attributes, layer, scale) {
		this.color = "black";
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.text = attributes.has("text") ? attributes.get("text") : "";
		const points = {
			x: parseInt(attributes.get("x")),
			y: parseInt(attributes.get("y")),
		};
		this.geometry = new Text(this, points, this.text, "black", scale);
		this.layer.add(this.geometry);
	}
	updateSidebar() {
		this.attributes.set("x", this.geometry.x());
		this.attributes.set("y", this.geometry.y());
		createSidebar(this);
	}
	updateText() {
		this.text = this.attributes.get("text");
		this.geometry.text(this.text);
		const points = {
			x: parseInt(this.attributes.get("x")),
			y: parseInt(this.attributes.get("y")),
		};
		this.geometry.position(points);
	}

	delete() {
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		this.layer.add(this.geometry);
		this.geometry.moveToTop();
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	lockDragging() {
		this.geometry.draggable(false);
	}

	toXML(doc, parent) {
		const labelElem = doc.createElement("label");
		labelElem.setAttribute("id", this.id);
		labelElem.setAttribute("text", this.text);
		labelElem.setAttribute("x", this.geometry.x());
		labelElem.setAttribute("y", this.geometry.y());
		parent.appendChild(labelElem);
	}
}

export function addLabel(attributes, layer, scale) {
	const label = new Label(attributes, layer, scale);
	objects.push(label);
	return label;
}
