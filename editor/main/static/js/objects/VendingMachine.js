import { createGeometry, createSidebar } from "./Helper.js";

export default class VendingMachine {
	constructor(attributes, layer, geometryType, geometry) {
		this.color = "yellow";
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		this.layer.add(this.geometry);
	}
	toString() {
		return `VendingMachine(${this.geometry.x()}-${this.geometry.y()})`;
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
		this.geometry.draggable(false);
	}

	toXML(doc, parent) {
		const machineElem = doc.createElement("vending-machine");
		this.attributes.forEach((val, key) => {
			machineElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, machineElem);
		parent.appendChild(machineElem);
	}
}

export function addVendingMachine(attributes, layer, geometryType, geometry) {
	const machine = new VendingMachine(attributes, layer, geometryType, geometry);
	objects.push(machine);
	return machine;
}
