import { createGeometry, createSidebar } from "./Helper.js";

export default class Lift {
	constructor(attributes, geometryType, geometry) {
		this.color = "blue";
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		layer.add(this.geometry);
	}
	toString() {
		return `Lift(${this.x()}-${this.y()})`;
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

	toXML(doc, parent) {
		const liftElem = doc.createElement("lift");
		this.attributes.forEach((val, key) => {
			liftElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, liftElem);
		parent.appendChild(liftElem);
	}
}

export function addLift(attributes, geometryType, geometry) {
	const lift = new Lift(attributes, geometryType, geometry);
	objects.push(lift);
	return lift;
}
