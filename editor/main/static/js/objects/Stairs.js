import { createGeometry, createSidebar } from "./Helper.js";

export default class Stairs {
	constructor(attributes, layer, geometryType, geometry, scale) {
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
			this.fontSize = Math.floor(12 * (1 / scale));
			this.typeText = new Konva.Text({
				text: this.text,
				x: textPosition.x + 4,
				y: textPosition.y - 4,
				fontSize: this.fontSize,
			});
			this.layer.add(this.typeText);
		}
		if (this.geometry.points().length === 8) {
			console.log("two lines");
		} else {
			console.log("two polylines");
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
		this.xmlLines(doc, stairElem, this.geometry.points());
		console.log(stairElem);
		parent.appendChild(stairElem);
	}

	xmlLines(doc, parent, points) {
		if (points.length === 8) {
			const line1 = doc.createElement("line");
			line1.setAttribute("x1", points[0]);
			line1.setAttribute("y1", points[1]);
			line1.setAttribute("x2", points[2]);
			line1.setAttribute("y2", points[3]);
			const line2 = doc.createElement("line");
			line2.setAttribute("x1", points[6]);
			line2.setAttribute("y1", points[7]);
			line2.setAttribute("x2", points[4]);
			line2.setAttribute("y2", points[5]);
			parent.appendChild(line1);
			parent.appendChild(line2);
		} else {
			const line1 = doc.createElement("polyline");
			for (let i = 0; i < points.length / 2; i += 2) {
				const point = doc.createElement("point");
				point.setAttribute("x", points[i]);
				point.setAttribute("y", points[i + 1]);
				line1.appendChild(point);
			}
			const line2 = doc.createElement("polyline");
			for (let i = points.length - 1; i > points.length / 2; i -= 2) {
				const point = doc.createElement("point");
				point.setAttribute("x", points[i - 1]);
				point.setAttribute("y", points[i]);
				line2.appendChild(point);
			}
			parent.appendChild(line1);
			parent.appendChild(line2);
		}
	}
}

export function addStairs(attributes, layer, geometryType, geometry, scale) {
	const stairs = new Stairs(attributes, layer, geometryType, geometry, scale);
	objects.push(stairs);
	return stairs;
}
