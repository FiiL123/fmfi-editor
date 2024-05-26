import { createGeometry, createSidebar } from "./Helper.js";

export default class Floor {
	constructor(attributes, geometryType, geometry) {
		this.color = "white";
		this.holeColor = "#ffefe0";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		if (geometryType === "hollowrectangle") {
			console.log("IM HOLLOW");
			this.geometryRect = createGeometry(
				this,
				"rectangle",
				geometry.rect,
				this.color,
			);
			this.geometryHole = createGeometry(
				this,
				"rectangle",
				geometry.holePoints,
				this.holeColor,
			);
			layer.add(this.geometryRect);
			console.log(this.geometryRect);
			layer.add(this.geometryHole);
		} else {
			this.geometry = createGeometry(this, geometryType, geometry, this.color);
			layer.add(this.geometry);
		}
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
		if (this.geometry) {
			this.geometry.draggable(false);
		} else {
			this.geometryRect.draggable(false);
			this.geometryHole.draggable(false);
		}
	}

	toXML(doc, parent) {
		const floorElem = doc.createElement("floor");
		this.attributes.forEach((val, key) => {
			floorElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, floorElem);
		parent.appendChild(floorElem);
	}
}

export function addFloor(attributes, geometryType, geometry) {
	const floor = new Floor(attributes, geometryType, geometry);
	objects.push(floor);
	return floor;
}
