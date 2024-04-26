import { createGeometry, createSidebar } from "./Helper.js";

export default class Floor {
	constructor(attributes, geometryType, geometry) {
		this.color = "white";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		layer.add(this.geometry);
	}

	updateSidebar() {
		createSidebar(this);
	}
	updateText() {}

	delete() {
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		layer.add(this.geometry);
		this.geometry.moveToBottom();
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	handleRoomClick() {
		selectedRoom = this;
		tr.nodes([this]);
		this.updateSidebar();
	}

	lockDragging() {
		this.geometry.draggable(false);
	}
}

export function addFloor(attributes, geometryType, geometry) {
	const floor = new Floor(attributes, geometryType, geometry);
	objects.push(floor);
	return floor;
}
