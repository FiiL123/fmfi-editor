import { TransformAction, TransformPolyAction } from "../../Actions.js";
import {
	createPointXMLElems,
	handlePolyPositionChange,
	handlePolySizeChange,
} from "./GeometryHelper.js";

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
			handlePolyPositionChange(this);
			this.room.updateSidebar();
			this.room.updateText();
			actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
		super.on("transformstart", function () {
			this.prevPoints = [...this.points()];
			this.handleRoomClick();
		});

		super.on("transform", function () {
			this.room.updateText();
		});

		super.on("transformend", function () {
			console.log("transform end");
			handlePolySizeChange(this);
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

	getLabelPoint() {
		return { x: this.points()[0], y: this.points()[1] };
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

		// Delete button
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "-";
		deleteButton.id = `pointDelete${i}`;
		deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2"); // Bootstrap button classes
		deleteButton.addEventListener("click", () => {
			pointDiv.remove(); // Removes the entire div containing inputs and buttons
			// Potentially update the data structure here
		});

		// Insert button
		const insertButton = document.createElement("button");
		insertButton.textContent = "+";
		insertButton.id = `pointInsert${i}`;
		insertButton.classList.add("btn", "btn-success", "btn-sm", "ms-2"); // Bootstrap button classes
		insertButton.addEventListener("click", () => {
			// Calculate new index for the point to be inserted
			const newPointIndex = index + 1;
			console.log(newPointIndex); // Debugging output
			this.points().splice(newPointIndex * 2, 0, 0, 0); // Corrected insertion of two zeros
			selectedRoom.updateSidebar();
		});

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
		pointDiv.appendChild(deleteButton);
		pointDiv.appendChild(insertButton);

		// Append the entire point div to the main component
		mainComponent.appendChild(pointDiv);
	}

	getFormData() {
		const pointInputs = document.querySelectorAll('[id^="pointInput"]');
		const points = [];
		for (const pointInput of pointInputs) {
			points.push(Math.floor(pointInput.value));
		}
		console.log(selectedRoom);
		selectedRoom.geometry.points(points);
		selectedRoom.geometry.startingPoints = points;
	}

	toString() {
		return `Polygon(${this.points()})`;
	}

	moveBack(prevPoints) {
		this.points(prevPoints);
		this.startingPoints = prevPoints;
		this.room.updateSidebar();
		this.room.updateText();
	}

	toXML(doc, parent) {
		const polyElem = doc.createElement("polygon");
		createPointXMLElems(doc, polyElem, this.points());
		parent.appendChild(polyElem);
	}
}
