import { createGeometry, createSidebar } from "./Helper.js";
import Polygon from "./Geometry/Polygon.js";
import { SwitchGeometryAction } from "../Actions.js";

export default class Room {
	constructor(attributes, layer, geometryType, geometry, scale) {
		const purpose = purposesData.find(
			(purpose) => purpose.pk === attributes.get("purpose"),
		);
		this.color = "lightgray";
		if (attributes.size > 0 && purpose && purpose.fields.colour !== "") {
			this.color = "rgb(" + purpose.fields.colour + ")";
		}
		this.attributes = attributes;
		this.layer = layer;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.number = attributes.has("number") ? attributes.get("number") : "";
		this.geometry = createGeometry(this, geometryType, geometry, this.color);
		this.layer.add(this.geometry);

		this.text = attributes.has("custom-map-label")
			? attributes.get("custom-map-label")
			: this.number;
		this.text = this.text.replace("\\n", "\n");

		const textPosition = this.geometry.getLabelPoint();
		this.fontSize = Math.floor(
			(attributes.has("important") ? 30 : 16) * (1 / scale),
		);
		this.numberText = new Konva.Text({
			text: this.text,
			x: textPosition.x + 4,
			y: textPosition.y + 4,
			fontSize: this.fontSize,
			perfectDrawEnabled: false,
		});
		this.layer.add(this.numberText);
	}

	updateSidebar() {
		createSidebar(this);
	}

	updateText() {
		this.text = this.attributes.has("custom-map-label")
			? this.attributes.get("custom-map-label")
			: this.number;
		this.text = this.text.replace("\\n", "\n");
		this.numberText.text(this.text);
		const textPosition = this.geometry.getLabelPoint();
		this.numberText.position({ x: textPosition.x, y: textPosition.y });
		this.numberText.moveToTop();
	}

	switchGeometry() {
		const oldGeometry = this.geometry;
		this.geometry.remove();
		if (this.geometry instanceof Polygon) {
			this.geometry = createGeometry(
				this,
				"rectangle",
				this.geometry.toRectanglePoints(),
				this.color,
			);
		} else {
			this.geometry = createGeometry(
				this,
				"polygon",
				this.geometry.toPolygonPoints(),
				this.color,
			);
		}
		actionManager.addAction(new SwitchGeometryAction(this, oldGeometry));
		this.layer.add(this.geometry);
		tr.nodes([this.geometry]);
		this.updateText();
		this.updateSidebar();
	}

	geometrySwap(geometry) {
		this.geometry.remove();
		this.geometry = geometry;
		this.layer.add(this.geometry);
		this.updateText();
		this.updateSidebar();
	}

	delete() {
		this.numberText.remove();
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		this.layer.add(this.geometry);
		this.layer.add(this.numberText);
	}

	moveBack(prevPosition) {
		this.geometry.moveBack(prevPosition);
	}

	lockDragging() {
		this.geometry.draggable(false);
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

export function addRoom(attributes, layer, geometryType, geometry, scale) {
	const room = new Room(attributes, layer, geometryType, geometry, scale);
	objects.push(room);
	return room;
}
