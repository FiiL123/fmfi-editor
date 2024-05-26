import { createGeometry, createSidebar } from "./Helper.js";

export default class Wall {
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
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	lockDragging() {
		this.geometry.draggable(false);
	}

	toXML(doc, parent) {
		const wallElem = doc.createElement("wall");
		wallElem.setAttribute("id", this.id);
		this.geometry.toXML(doc, wallElem);
		parent.appendChild(wallElem);
	}
}

export function addWall(attributes, layer, geometryType, geometry) {
	const wall = new Wall(attributes, layer, geometryType, geometry);
	objects.push(wall);
	return wall;
}
