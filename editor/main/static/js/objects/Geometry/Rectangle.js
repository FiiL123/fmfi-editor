import { TransformAction } from "../../Actions.js";

export default class Rectangle extends Konva.Rect {
	constructor(room, x, y, w, h, color) {
		super({
			x: x,
			y: y,
			width: w,
			height: h,
			fill: color,
			stroke: "black",
			draggable: true,
		});
		this.room = room;
		super.on("transformstart", function () {
			this.prevX = this.x();
			this.prevY = this.y();
			this.prevW = this.width();
			this.prevH = this.height();
			this.handleRoomClick();
		});

		super.on("dragmove", function () {
			this.handlePositionChange();
			this.room.updateText();
		});

		super.on("dragstart", function () {
			this.prevX = this.x();
			this.prevY = this.y();
			this.prevW = this.width();
			this.prevH = this.height();
			this.handleRoomClick();
		});
		super.on("dragend", function () {
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
			this.room.updateText();
		});

		super.on("transformend", function () {
			this.handlePositionChange();
			this.handleSizeChange();
			this.room.updateSidebar();
			this.room.updateText();
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
	}

	handleRoomClick() {
		selectedRoom = this.room;
		tr.nodes([this]);
		this.room.updateSidebar();
	}

	handlePositionChange() {
		this.x(Math.floor(this.x()));
		this.y(Math.floor(this.y()));
	}

	handleSizeChange() {
		const roomWidth = Math.floor(this.width() * this.scaleX());
		const roomHeight = Math.floor(this.height() * this.scaleY());
		this.scaleX(1);
		this.scaleY(1);
		this.width(roomWidth);
		this.height(roomHeight);
	}

	getLabelPoint() {
		return `Rectangle(${this.x},${this.y})`;
	}

	createFormItems(elemtent) {
		const roomWidthInput = document.createElement("input");
		roomWidthInput.id = "roomWidth";
		roomWidthInput.type = "number";
		roomWidthInput.name = "roomWidth";
		const roomWidthLabel = document.createElement("label");
		roomWidthLabel.for = "roomWidth";
		roomWidthLabel.textContent = "Width:";
		elemtent.appendChild(roomWidthLabel);
		roomWidthInput.value = this.width() * this.scaleX();

		elemtent.appendChild(roomWidthInput);

		const roomHeightInput = document.createElement("input");
		roomHeightInput.id = "roomHeight";
		roomHeightInput.type = "number";
		roomHeightInput.name = "roomHeight";
		roomHeightInput.value = this.height() * this.scaleY();
		const roomHeightLabel = document.createElement("label");
		roomHeightLabel.for = "roomHeight";
		roomHeightLabel.textContent = "Height:";
		elemtent.appendChild(roomHeightLabel);
		elemtent.appendChild(roomHeightInput);

		const roomXInput = document.createElement("input");
		roomXInput.id = "roomX";
		roomXInput.type = "number";
		roomXInput.name = "roomX";
		roomXInput.value = this.x();
		const roomXLabel = document.createElement("label");
		roomXLabel.for = "roomX";
		roomXLabel.textContent = "X:";
		elemtent.appendChild(roomXLabel);
		elemtent.appendChild(roomXInput);

		const roomYInput = document.createElement("input");
		roomYInput.id = "roomY";
		roomYInput.type = "number";
		roomYInput.name = "roomY";
		roomYInput.value = this.y();
		const roomYLabel = document.createElement("label");
		roomYLabel.for = "roomY";
		roomYLabel.textContent = "Y:";
		elemtent.appendChild(roomYLabel);
		elemtent.appendChild(roomYInput);
	}

	getFormData() {
		const newWidth = Math.floor(
			Number(document.getElementById("roomWidth").value),
		);
		const newHeight = Math.floor(
			Number(document.getElementById("roomHeight").value),
		);
		const newX = Math.floor(Number(document.getElementById("roomX").value));
		const newY = Math.floor(Number(document.getElementById("roomY").value));

		selectedRoom.geometry.width(newWidth);
		selectedRoom.geometry.height(newHeight);
		selectedRoom.geometry.x(newX);
		selectedRoom.geometry.y(newY);
	}

	toString() {
		return "Rectangle(" + this.x + "," + this.y + ")";
	}

	moveBack(prev) {
		this.x(prev.x);
		this.y(prev.y);
		this.width(prev.w);
		this.height(prev.h);
		this.room.updateSidebar();
		this.room.updateText();
	}
}
