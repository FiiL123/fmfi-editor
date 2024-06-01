import { TransformPolyAction } from "../../Actions.js";
import {
	handlePolyPositionChange,
	handlePolySizeChange,
} from "./GeometryHelper.js";

export default class Arrow extends Konva.Arrow {
	constructor(room, points, color) {
		super({
			points: points,
			stroke: color,
			fill: color,
			strokeWidth: 10,
			pointerLength: 20,
			pointerWidth: 20,
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
			handlePolyPositionChange(this);
			this.room.updateSidebar();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
		super.on("transformstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});

		super.on("transformend", function () {
			console.log("transform end");
			handlePolySizeChange(this);
			this.room.updateSidebar();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
	}

	handleRoomClick() {
		selectedRoom = this.room;
		tr.nodes([this]);
		this.room.updateSidebar();
	}

	createFormItems(elemtent) {
		const pointsDiv = document.createElement("div");
		pointsDiv.id = "pointsDiv";
		pointsDiv.classList.add("attributes");
		const points = this.points();
		for (let i = 0; i < points.length / 2; ++i) {
			this.makePointInput(pointsDiv, i);
		}
		elemtent.appendChild(pointsDiv);
	}

	makePointInput(mainComponent, index) {
		const points = this.points();
		let i = index * 2;

		// Create a div for each point to contain the label, inputs, and buttons
		const pointDiv = document.createElement("div");
		pointDiv.classList.add("mb-3", "d-flex", "align-items-center"); // Bootstrap classes for margin and flex layout

		// Label for X and Y inputs
		const pointLabel = document.createElement("label");
		pointLabel.htmlFor = `pointInput${i}`;
		pointLabel.textContent = `Point(${index}):`;
		pointLabel.id = `pointLabel${i}`;
		pointLabel.classList.add("form-label", "me-2"); // Bootstrap label class with right margin

		// Input for X coordinate
		const pointXInput = document.createElement("input");
		pointXInput.id = `pointInput${i}`;
		pointXInput.type = "number";
		pointXInput.classList.add("form-control", "form-control-sm", "me-2"); // Bootstrap input class
		pointXInput.value = points[i];

		// Input for Y coordinate
		const pointYInput = document.createElement("input");
		pointYInput.id = `pointInput${i + 1}`;
		pointYInput.type = "number";
		pointYInput.classList.add("form-control", "form-control-sm", "me-2"); // Bootstrap input class
		pointYInput.value = points[i + 1];

		// Append all elements to the div
		pointDiv.appendChild(pointLabel);
		pointDiv.appendChild(pointXInput);
		pointDiv.appendChild(pointYInput);

		// Append the entire point div to the main component
		mainComponent.appendChild(pointDiv);
	}

	getFormData() {
		const pointInputs = document.querySelectorAll('[id^="pointInput"]');
		const points = [];
		for (const pointInput of pointInputs) {
			points.push(Math.floor(pointInput.value));
		}
		selectedRoom.geometry.points(points);
		selectedRoom.geometry.startingPoints = points;
	}

	moveBack(prevPoints) {
		this.points(prevPoints);
		this.startingPoints = prevPoints;
		this.room.updateSidebar();
	}

	toXML(doc, parent) {
		const lineElem = doc.createElement("line");
		lineElem.setAttribute("x1", this.points()[0]);
		lineElem.setAttribute("y1", this.points()[1]);
		lineElem.setAttribute("x2", this.points()[2]);
		lineElem.setAttribute("y2", this.points()[3]);
		parent.appendChild(lineElem);
	}
}
