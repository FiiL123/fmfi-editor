import Polygon from "./Geometry/Polygon.js";
import Rectangle from "./Geometry/Rectangle.js";
import { createGeometry, createSidebar } from "./Helper.js";

export default class Room {
	constructor(attributes, geometryType, geometry) {
		const purpose = purposesData.find(
			(purpose) => purpose.pk === attributes.get("purpose"),
		);
		this.color = getRandomColor();
		if (attributes.size > 0) {
			this.color =
				purpose && purpose.fields.colour !== ""
					? "rgb(" + purpose.fields.colour + ")"
					: "lightgray";
		}
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.number = attributes.has("number") ? attributes.get("number") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		layer.add(this.geometry);

		// TODO velkost fontu na zaklade skaly partu?
		this.text = attributes.has("custom-map-label")
			? attributes.get("custom-map-label")
			: this.number;
		this.text = this.text.replace("\\n", "\n");

		const textPosition = this.geometry.getLabelPoint();
		this.numberText = new Konva.Text({
			text: this.text,
			x: textPosition.x + 2,
			y: textPosition.y + 2,
			fontSize: attributes.has("important") ? 30 : 24,
		});
		layer.add(this.numberText);
	}

	updateSidebar() {
		createSidebar(this);
	}

	updateText() {
		this.numberText.text(
			this.attributes.has("custom-map-label")
				? this.attributes.get("custom-map-label")
				: this.number,
		);
		const textPosition = this.geometry.getLabelPoint();
		this.numberText.position({ x: textPosition.x, y: textPosition.y });
	}

	delete() {
		this.numberText.remove();
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		// TODO if floor, move to bottom
		layer.add(this.geometry);
		layer.add(this.numberText);
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
		this.draggable(false);
	}
	toXML(doc, parent) {
		const roomElem = doc.createElement("room");
		this.attributes.forEach((val, key) => {
			roomElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, roomElem);
		parent.appendChild(roomElem);
	}
}

export function addRoom(attributes, geometryType, geometry) {
	const room = new Room(attributes, geometryType, geometry);
	objects.push(room);
	return room;
}
