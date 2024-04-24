import { TransformAction, TransformPolyAction } from "../../Actions.js";

export default class Polygon extends Konva.Line {
	constructor(room, points, color) {
		super({
			points: points,
			fill: color,
			stroke: "black",
			closed: true,
			draggable: true,
		});
		this.room = room;
		this.startingPoints = points;
		super.on("click", this.handleRoomClick);
		super.on("dragstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});
		super.on("dragend", function () {
			this.handlePositionChange();
			this.room.updateSidebar();
			this.room.updateText();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
		super.on("transformstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});
		//
		// super.on('dragmove', function () {
		//     this.handlePositionChange();
		//     this.room.updateText();
		// });
		super.on("transform", function () {
			this.room.updateText();
		});

		super.on("transformend", function () {
			console.log("transform end");
			this.handleSizeChange();
			this.handlePositionChange();
			this.room.updateSidebar();
			this.room.updateText();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
	}

	handleRoomClick() {
		selectedRoom = this.room;
		tr.nodes([this]);
		this.room.updateSidebar();
	}

	handlePositionChange() {
		const points = this.points();

		for (let i = 0; i < points.length; i++) {
			if (i % 2 === 0) {
				points[i] = Math.floor(this.startingPoints[i] + this.x());
			} else {
				points[i] = Math.floor(this.startingPoints[i] + this.y());
			}
		}
		this.x(0);
		this.y(0);
		this.points(points);
		this.startingPoints = points;
	}

	handleSizeChange() {
		const points = this.points();
		for (let i = 0; i < points.length; i++) {
			if (i % 2 === 0) {
				points[i] = Math.floor(this.startingPoints[i] * this.scaleX());
			} else {
				points[i] = Math.floor(this.startingPoints[i] * this.scaleY());
			}
		}

		this.scaleX(1);
		this.scaleY(1);
		this.points(points);
		this.startingPoints = points;
	}

	getLabelPoint() {
		return { x: this.points()[0], y: this.points()[1] };
	}

	createFormItems(elemtent) {
		var pointsDiv = document.createElement("div");
		pointsDiv.id = "pointsDiv";
		pointsDiv.classList.add("attributes");
		const points = this.points();
		for (let i = 0; i < points.length / 2; ++i) {
			this.makePointInput(pointsDiv, i);
		}
		elemtent.appendChild(pointsDiv);
	}

	makePointInput(mainComponent, i) {
		const points = this.points();
		i = i * 2;

		const pointLabel = document.createElement("label");
		pointLabel.for = "pointInput" + i;
		pointLabel.textContent = "Point(" + i / 2 + "):";
		pointLabel.id = "pointLabel" + i;
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "-";
		deleteButton.id = "pointDelete" + i;
		deleteButton.addEventListener("click", () => {
			console.log("deleting");
			document.getElementById("pointInput" + i).remove();
			document.getElementById("pointInput" + (i + 1)).remove();
			document.getElementById("pointLabel" + i).remove();
			document.getElementById("pointDelete" + i).remove();
		});
		mainComponent.appendChild(deleteButton);
		const pointXInput = document.createElement("input");
		pointXInput.id = "pointInput" + i;
		pointXInput.type = "number";
		pointXInput.size = 5;
		pointXInput.value = points[i];
		mainComponent.appendChild(pointLabel);
		mainComponent.appendChild(pointXInput);
		const pointYInput = document.createElement("input");
		pointYInput.id = "pointInput" + (i + 1);
		pointYInput.type = "number";
		pointYInput.size = 5;
		pointYInput.value = points[i + 1];
		mainComponent.appendChild(pointYInput);
	}

	getFormData() {
		var pointInputs = document.querySelectorAll('[id^="pointInput"]');
		const points = [];
		pointInputs.forEach((inp) => {
			points.push(Math.floor(inp.value));
		});
		selectedRoom.points(points);
		selectedRoom.startingPoints = points;
	}

	toString() {
		return "Polygon(" + this.points() + ")";
	}

	moveBack(prevPoints) {
		this.points(prevPoints);
		this.startingPoints = prevPoints;
		this.room.updateSidebar();
		this.room.updateText();
	}
}
