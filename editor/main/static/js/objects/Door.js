import { createGeometry, createSidebar } from "./Helper.js";

export default class Door {
	constructor(attributes, layer, geometryType, geometry) {
		this.color = "red";
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
		const doorElem = doc.createElement("door");
		doorElem.setAttribute("id", this.id);
		this.geometry.toXML(doc, doorElem);
		parent.appendChild(doorElem);
	}
}

export function addDoor(attributes, layer, geometryType, geometry) {
	const door = new Door(attributes, layer, geometryType, geometry);
	objects.push(door);
	door.geometry.moveToTop();
	return door;
}
