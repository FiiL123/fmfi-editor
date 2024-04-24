import { TransformAction } from "../Actions.js";

export default class RectangularRoom extends Konva.Rect {
	constructor(x, y, w, h, tr, attributes = new Map()) {
		const purpose = purposesData.find(
			(purpose) => purpose.pk === attributes.get("purpose"),
		);
		let color = getRandomColor();
		if (attributes.size > 0) {
			color =
				purpose && purpose.fields.colour !== ""
					? "rgb(" + purpose.fields.colour + ")"
					: "lightgray";
			if (attributes.get("id").startsWith("f-")) color = "white";
		}
		super({
			x: x,
			y: y,
			width: w,
			height: h,
			fill: color,
			stroke: "black",
			draggable: true,
		});
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.number = attributes.has("number") ? attributes.get("number") : "";
		super.on("transformstart", function () {
			console.log("transform start");
			this.prevX = this.x();
			this.prevY = this.y();
			this.prevW = this.width();
			this.prevH = this.height();
			this.handleRoomClick();
		});

		super.on("dragmove", function () {
			// updateText();
			this.handlePositionChange();
			this.updateTextPosition();
		});

		super.on("dragstart", function () {
			console.log("drag start");
			this.prevX = this.x();
			this.prevY = this.y();
			this.prevW = this.width();
			this.prevH = this.height();
			this.handleRoomClick();
		});
		super.on("dragend", function () {
			console.log("drag end");
			actionManager.addAction(
				new TransformAction(
					this,
					this.prevX,
					this.prevY,
					this.prevW,
					this.prevH,
				),
			);
		});
		super.on("transform", function () {
			// updateText();
			console.log("transform");
			this.updateTextPosition();
		});

		super.on("transformend", function () {
			console.log("transform end");
			this.handlePositionChange();
			this.handleSizeChange();
			this.updateTextPosition();
			actionManager.addAction(
				new TransformAction(
					this,
					this.prevX,
					this.prevY,
					this.prevW,
					this.prevH,
				),
			);
		});

		super.on("click", this.handleRoomClick);

		this.text = attributes.has("custom-map-label")
			? attributes.get("custom-map-label")
			: this.number;
		this.text = this.text.replace("\\n", "\n");
		this.numberText = new Konva.Text({
			text: this.text,
			x: x + 2,
			y: y + 2,
			fontSize: attributes.has("important") ? 30 : 24,
		});
		// this.numberText.on('click',this.handleRoomClick)
	}
	toString() {
		return `RectRoom(${this.x()}-${this.y()})`;
	}
	handlePositionChange() {
		const intersectObj = this.isIntersecting();
		if (intersectObj === null) {
			const roomX = Math.floor(this.x());
			const roomY = Math.floor(this.y());
			this.x(roomX);
			this.y(roomY);
		} else {
			const snapDistance =
				Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / 4; // Adjust this value as needed for your snapping sensitivity, 1/4 of the diagonal
			console.log("snp dist:" + snapDistance);
			// Snap horizontally
			if (
				Math.abs(
					this.y() +
						this.height() / 2 -
						intersectObj.y() -
						intersectObj.height() / 2,
				) < snapDistance
			) {
				if (this.x() + this.width() < intersectObj.x() + snapDistance) {
					this.x(intersectObj.x() - this.width());
				} else if (
					this.x() >
					intersectObj.x() + intersectObj.width() - snapDistance
				) {
					this.x(intersectObj.x() + intersectObj.width());
				}
			}

			// Snap vertically
			if (
				Math.abs(
					this.x() +
						this.width() / 2 -
						intersectObj.x() -
						intersectObj.width() / 2,
				) < snapDistance
			) {
				if (this.y() + this.height() < intersectObj.y() + snapDistance) {
					this.y(intersectObj.y() - this.height());
				} else if (
					this.y() >
					intersectObj.y() + intersectObj.height() - snapDistance
				) {
					this.y(intersectObj.y() + intersectObj.height());
				}
			}
		}
	}
	updateTextPosition() {
		const textX = this.x() + 2; // Adjust for bottom right corner
		const textY = this.y() + 2; // Adjust for bottom right corner
		this.numberText.position({ x: textX, y: textY });
	}
	handleSizeChange() {
		const roomWidth = Math.floor(this.width() * this.scaleX());
		const roomHeight = Math.floor(this.height() * this.scaleY());
		this.scaleX(1);
		this.scaleY(1);
		this.width(roomWidth);
		this.height(roomHeight);
	}

	isIntersecting() {
		const layer = this.getLayer();
		const children = layer.getChildren();
		for (const obj of children) {
			if (
				obj instanceof RectangularRoom &&
				haveIntersection(this, obj) &&
				!(this === obj)
			) {
				console.log("Overlap:" + this + " - > " + obj);
				return obj;
			}
		}
		return null;
	}

	updateSidebar() {
		// Access the sidebar form elements
		var existingAttributesDiv = document.getElementById("attributesDiv");
		if (existingAttributesDiv) {
			existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
		}
		var attributesDiv = document.createElement("div");
		attributesDiv.id = "attributesDiv";
		attributesDiv.classList.add("attributes"); // You can add CSS classes for styling
		var rectRoomForm = document.createElement("form");
		rectRoomForm.id = "polygonRoomForm";

		this.attributes.forEach((value, key) => {
			console.log("creating: " + key);
			var input = document.createElement("input");
			var label = document.createElement("label");
			var inputId = key.replace(/[^a-zA-Z0-9]/g, "_"); // Creating a safe id by replacing non-alphanumerics

			input.id = inputId;
			input.name = key;
			input.type = "text"; // Default to text, adjust as necessary
			input.value = value;

			label.htmlFor = inputId;
			label.textContent =
				key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ") + ":";

			rectRoomForm.appendChild(label);
			rectRoomForm.appendChild(input);
			rectRoomForm.appendChild(document.createElement("br")); // Optional: add line break for better readability
		});

		var roomWidthInput = document.createElement("input");
		roomWidthInput.id = "roomWidth";
		roomWidthInput.type = "number";
		roomWidthInput.name = "roomWidth";
		var roomWidthLabel = document.createElement("label");
		roomWidthLabel.for = "roomWidth";
		roomWidthLabel.textContent = "Width:";
		rectRoomForm.appendChild(roomWidthLabel);
		roomWidthInput.value = this.width() * this.scaleX();

		rectRoomForm.appendChild(roomWidthInput);

		var roomHeightInput = document.createElement("input");
		roomHeightInput.id = "roomHeight";
		roomHeightInput.type = "number";
		roomHeightInput.name = "roomHeight";
		roomHeightInput.value = this.height() * this.scaleY();
		var roomHeightLabel = document.createElement("label");
		roomHeightLabel.for = "roomHeight";
		roomHeightLabel.textContent = "Height:";
		rectRoomForm.appendChild(roomHeightLabel);
		rectRoomForm.appendChild(roomHeightInput);

		var roomXInput = document.createElement("input");
		roomXInput.id = "roomX";
		roomXInput.type = "number";
		roomXInput.name = "roomX";
		roomXInput.value = this.x();
		var roomXLabel = document.createElement("label");
		roomXLabel.for = "roomX";
		roomXLabel.textContent = "X:";
		rectRoomForm.appendChild(roomXLabel);
		rectRoomForm.appendChild(roomXInput);

		var roomYInput = document.createElement("input");
		roomYInput.id = "roomY";
		roomYInput.type = "number";
		roomYInput.name = "roomY";
		roomYInput.value = this.y();
		var roomYLabel = document.createElement("label");
		roomYLabel.for = "roomY";
		roomYLabel.textContent = "Y:";
		rectRoomForm.appendChild(roomYLabel);
		rectRoomForm.appendChild(roomYInput);

		var formButton = document.createElement("button");
		formButton.type = "submit";
		formButton.id = "updateRoomDetailsBtn";
		formButton.style.display = "block";
		formButton.textContent = "Update";
		attributesDiv.appendChild(rectRoomForm);
		rectRoomForm.appendChild(formButton);
		document.getElementById("sidebar").appendChild(attributesDiv);

		rectRoomForm.addEventListener("submit", (event) => {
			event.preventDefault();

			// Update the selected room with the edited details
			var newAttributes = new Map();
			selectedRoom.attributes.forEach((value, key) => {
				var inputId = key.replace(/[^a-zA-Z0-9]/g, "_");
				var inputValue = document.getElementById(inputId).value;
				newAttributes.set(key, inputValue);
				// Assuming selectedRoom is an object that has methods or properties matching keys
				if (typeof selectedRoom[key] === "function") {
					selectedRoom[key](inputValue); // If it's a method, call it
				} else {
					selectedRoom[key] = inputValue; // Otherwise, set the property
				}
			});
			selectedRoom.attributes = newAttributes;
			const newWidth = Math.floor(
				Number(document.getElementById("roomWidth").value),
			);
			const newHeight = Math.floor(
				Number(document.getElementById("roomHeight").value),
			);
			const newX = Math.floor(Number(document.getElementById("roomX").value));
			const newY = Math.floor(Number(document.getElementById("roomY").value));

			selectedRoom.width(newWidth);
			selectedRoom.height(newHeight);
			selectedRoom.x(newX);
			selectedRoom.y(newY);
			selectedRoom.numberText.text(
				newAttributes.has("custom-map-label")
					? newAttributes.get("custom-map-label")
					: selectedRoom.number,
			);
			selectedRoom.updateTextPosition();
		});
	}

	handleRoomClick() {
		selectedRoom = this;
		tr.nodes([this]);
		this.updateSidebar();
	}

	delete() {
		this.numberText.remove();
		tr.nodes([]);
	}

	ressurect() {
		layer.add(this);
		layer.add(this.numberText);
	}

	moveBack(prevX, prevY, prevW, prevH) {
		this.x(prevX);
		this.y(prevY);
		this.width(prevW);
		this.height(prevH);
		this.updateTextPosition();
		this.updateSidebar();
	}

	lockDragging() {
		this.draggable(false);
	}
}

export function addRectRoom(
	x = 100,
	y = 90,
	w = 100,
	h = 100,
	attributes = new Map(),
) {
	const room = new RectangularRoom(x, y, w, h, tr, attributes);
	layer.add(room);
	layer.add(room.numberText);
	return room;
}

function haveIntersection(r1, r2) {
	return !(
		r2.x() > r1.x() + r1.width() ||
		r2.x() + r2.width() < r1.x() ||
		r2.y() > r1.y() + r1.height() ||
		r2.y() + r2.height() < r1.y()
	);
}
