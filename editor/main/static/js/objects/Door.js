import { TransformPolyAction } from "../Actions.js";

export default class Door extends Konva.Line {
	constructor(points, id = "") {
		super({
			points: points,
			stroke: "red",
			draggable: true,
		});
		this.startingPoints = points;
		this.id = id;

		super.on("click", this.handleRoomClick);
		super.on("dragmove", () => {});
		super.on("dragstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});
		super.on("dragend", function () {
			this.updatePosition();
			this.updateSidebar();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});

		super.on("transformstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});
		super.on("transformend", function () {
			this.updateScale();
			this.updatePosition();
			this.updateSidebar();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
	}
	updateSidebar() {
		const existingAttributesDiv = document.getElementById("attributesDiv");
		if (existingAttributesDiv) {
			existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
		}
		const attributesDiv = document.createElement("div");
		attributesDiv.id = "attributesDiv";
		attributesDiv.classList.add("attributes");
		const doorForm = document.createElement("form");
		doorForm.id = "doorForm";

		const doorIDInput = document.createElement("input");
		doorIDInput.id = "doorID";
		doorIDInput.type = "text";
		doorIDInput.name = "doorID";
		doorIDInput.value = this.id;
		const doorIDLabel = document.createElement("label");
		doorIDLabel.for = "doorID";
		doorIDLabel.textContent = "ID:";
		doorForm.appendChild(doorIDLabel);
		doorForm.appendChild(doorIDInput);

		const points = this.points();
		const pointLabel = document.createElement("label");
		pointLabel.for = "pointInput1";
		pointLabel.textContent = "Point(1):";
		pointLabel.id = "pointLabel" + 1;
		const pointXInput = document.createElement("input");
		pointXInput.id = "pointInput1";
		pointXInput.type = "number";
		pointXInput.size = 5;
		pointXInput.value = points[0];
		doorForm.appendChild(pointLabel);
		doorForm.appendChild(pointXInput);
		const pointYInput = document.createElement("input");
		pointYInput.id = "pointInput2";
		pointYInput.type = "number";
		pointYInput.size = 5;
		pointYInput.value = points[1];
		doorForm.appendChild(pointYInput);

		const pointLabel2 = document.createElement("label");
		pointLabel2.for = "pointInput3";
		pointLabel2.textContent = "Point(2):";
		pointLabel2.id = "pointLabel" + 2;
		const pointXInput2 = document.createElement("input");
		pointXInput2.id = "pointInput3";
		pointXInput2.type = "number";
		pointXInput2.size = 5;
		pointXInput2.value = points[2];
		doorForm.appendChild(pointLabel2);
		doorForm.appendChild(pointXInput2);
		const pointYInput2 = document.createElement("input");
		pointYInput2.id = "pointInput4";
		pointYInput2.type = "number";
		pointYInput2.size = 5;
		pointYInput2.value = points[3];
		doorForm.appendChild(pointYInput2);

		const formButton = document.createElement("button");
		formButton.type = "submit";
		formButton.id = "updateDoorDetailsBtn";
		formButton.style.display = "block";
		formButton.textContent = "Update";
		attributesDiv.appendChild(doorForm);
		doorForm.appendChild(formButton);
		document.getElementById("sidebar").appendChild(attributesDiv);
		doorForm.addEventListener("submit", (event) => {
			const newID = document.getElementById("doorID").value;
			selectedRoom.id = newID;
			const pointInputs = document.querySelectorAll('[id^="pointInput"]');
			const points = [];
			pointInputs.forEach((inp) => {
				points.push(Math.floor(inp.value));
			});
			selectedRoom.points(points);
			selectedRoom.updateSidebar();
		});
	}

	handleRoomClick() {
		selectedRoom = this;
		tr.nodes([this]);
		this.updateSidebar();
	}
	updateScale() {
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

	updatePosition() {
		const points = this.points();
		// console.log(points)
		// console.log(this.x())
		// console.log(this.y())
		this.moveToTop();
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
	delete() {
		tr.nodes([]);
		this.remove();
	}

	ressurect() {
		layer.add(this);
	}

	moveBack(prevPoints) {
		this.points(prevPoints);
		this.startingPoints = prevPoints;
		this.updateSidebar();
	}
}

export function addDoor(points = [], id = "d-0-0") {
	if (points.length === 0) points = [50, 50, 80, 50];
	const door = new Door(points, id);
	layer.add(door);
	objects.push(door);
	door.moveToTop();
	return door;
}
