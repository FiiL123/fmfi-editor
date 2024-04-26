import { createGeometry, createSidebar } from "./Helper.js";

export default class Door {
	constructor(attributes, geometryType, geometry) {
		this.color = "red";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		layer.add(this.geometry);
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
		layer.add(this.geometry);
		this.geometry.moveToTop();
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	lockDragging() {
		this.geometry.draggable(false);
	}

	toXML(doc, parent) {
		const doorElem = doc.createElement("door");
		doorElem.setAttribute("id", this.id);
		this.geometry.toXML(doc, doorElem);
		parent.appendChild(doorElem);
	}
}

export function addDoor(attributes, geometryType, geometry) {
	const door = new Door(attributes, geometryType, geometry);
	objects.push(door);
	door.geometry.moveToTop();
	return door;
}
