import { createGeometry, createSidebar } from "./Helper.js";

export default class ArrowObj {
	constructor(attributes, layer, geometryType, geometry) {
		this.color = "black";
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		this.layer.add(this.geometry);
	}
	updateSidebar() {
		createSidebar(this);
		this.geometry.moveToTop();
	}

	handleRoomClick() {
		selectedRoom = this;
		tr.nodes([this]);
		this.updateSidebar();
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
		const doorElem = doc.createElement("arrow");
		doorElem.setAttribute("id", this.id);
		this.geometry.toXML(doc, doorElem);
		parent.appendChild(doorElem);
	}
}

export function addArrow(attributes, layer, geometryType, geometry) {
	const arrow = new ArrowObj(attributes, layer, geometryType, geometry);
	objects.push(arrow);
	arrow.geometry.moveToTop();
	return arrow;
}
