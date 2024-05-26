import { createGeometry, createSidebar } from "./Helper.js";

export default class Stairs {
	constructor(attributes, layer, geometryType, geometry) {
		this.color = "magenta";
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		this.isStairway = !attributes.has("steps");
		this.layer.add(this.geometry);

		if (this.isStairway) {
			this.text = attributes.has("type") ? attributes.get("type") : "U-shaped";
			const textPosition = this.geometry.getLabelPoint();
			this.fontSize = Math.floor(12 * (1 / part_scale));
			this.typeText = new Konva.Text({
				text: this.text,
				x: textPosition.x + 4,
				y: textPosition.y - 4,
				fontSize: this.fontSize,
			});
			this.layer.add(this.typeText);
		}
	}

	toString() {
		return `Stairs(${this.geometry.points()})`;
	}

	updateSidebar() {
		createSidebar(this);
	}

	updateText() {
		this.text = this.attributes.has("type")
			? this.attributes.get("type")
			: "U-shaped";
		this.typeText.text(this.text);
		const textPosition = this.geometry.getLabelPoint();
		this.typeText.position({ x: textPosition.x, y: textPosition.y });
	}

	delete() {
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		this.layer.add(this.geometry);
		if (this.attributes.has("type")) {
			this.layer.add(this.typeText);
		}
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
		const stairElem = this.isStairway
			? doc.createElement("stairway")
			: doc.createElement("stairs");
		this.attributes.forEach((val, key) => {
			stairElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, stairElem);
		parent.appendChild(stairElem);
	}
}

export function addStairs(attributes, layer, geometryType, geometry) {
	const stairs = new Stairs(attributes, layer, geometryType, geometry);
	objects.push(stairs);
	return stairs;
}
