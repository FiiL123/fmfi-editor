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
		return { x: this.x(), y: this.y() };
	}

	createFormItems(elemtent) {
		const roomWidthDiv = document.createElement("div");
		roomWidthDiv.classList.add("mb-3");
		const roomWidthInput = document.createElement("input");
		roomWidthInput.classList.add("form-control");
		roomWidthInput.id = "roomWidth";
		roomWidthInput.type = "number";
		roomWidthInput.name = "roomWidth";
		roomWidthInput.value = this.width() * this.scaleX();

		const roomWidthLabel = document.createElement("label");
		roomWidthLabel.classList.add("form-label");
		roomWidthLabel.htmlFor = "roomWidth";
		roomWidthLabel.textContent = "Width:";

		roomWidthDiv.appendChild(roomWidthLabel);
		roomWidthDiv.appendChild(roomWidthInput);
		elemtent.appendChild(roomWidthDiv);

		const roomHeightDiv = document.createElement("div");
		roomHeightDiv.classList.add("mb-3");
		const roomHeightInput = document.createElement("input");
		roomHeightInput.classList.add("form-control");
		roomHeightInput.id = "roomHeight";
		roomHeightInput.type = "number";
		roomHeightInput.name = "roomHeight";
		roomHeightInput.value = this.height() * this.scaleY();

		const roomHeightLabel = document.createElement("label");
		roomHeightLabel.classList.add("form-label");
		roomHeightLabel.htmlFor = "roomHeight";
		roomHeightLabel.textContent = "Height:";

		roomHeightDiv.appendChild(roomHeightLabel);
		roomHeightDiv.appendChild(roomHeightInput);
		elemtent.appendChild(roomHeightDiv);

		const roomXDiv = document.createElement("div");
		roomXDiv.classList.add("mb-3");
		const roomXInput = document.createElement("input");
		roomXInput.classList.add("form-control");
		roomXInput.id = "roomX";
		roomXInput.type = "number";
		roomXInput.name = "roomX";
		roomXInput.value = this.x();

		const roomXLabel = document.createElement("label");
		roomXLabel.classList.add("form-label");
		roomXLabel.htmlFor = "roomX";
		roomXLabel.textContent = "X:";

		roomXDiv.appendChild(roomXLabel);
		roomXDiv.appendChild(roomXInput);
		elemtent.appendChild(roomXDiv);

		const roomYDiv = document.createElement("div");
		roomYDiv.classList.add("mb-3");
		const roomYInput = document.createElement("input");
		roomYInput.classList.add("form-control");
		roomYInput.id = "roomY";
		roomYInput.type = "number";
		roomYInput.name = "roomY";
		roomYInput.value = this.y();

		const roomYLabel = document.createElement("label");
		roomYLabel.classList.add("form-label");
		roomYLabel.htmlFor = "roomY";
		roomYLabel.textContent = "Y:";

		roomYDiv.appendChild(roomYLabel);
		roomYDiv.appendChild(roomYInput);
		elemtent.appendChild(roomYDiv);
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

	toXML(doc, parent) {
		const rectElem = doc.createElement("rectangle");
		rectElem.setAttribute("x1", this.x());
		rectElem.setAttribute("y1", this.y());
		rectElem.setAttribute("x2", this.x() + this.width());
		rectElem.setAttribute("y2", this.y() + this.height());
		parent.appendChild(rectElem);
	}
}
