import { createGeometry, createSidebar } from "./Helper.js";

export default class Floor {
	constructor(attributes, layer, geometryType, geometry) {
		this.color = "white";
		this.holeColor = "#ffefe0";
		this.attributes = attributes;
		this.layer = layer;
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
			this.layer.add(this.geometryRect);
			console.log(this.geometryRect);
			this.layer.add(this.geometryHole);
		} else {
			this.geometry = createGeometry(this, geometryType, geometry, this.color);
			this.layer.add(this.geometry);
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
		this.layer.add(this.geometry);
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

export function addFloor(attributes, layer, geometryType, geometry) {
	const floor = new Floor(attributes, layer, geometryType, geometry);
	objects.push(floor);
	return floor;
}
