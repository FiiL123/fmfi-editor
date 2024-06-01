import Rectangle from "./Geometry/Rectangle.js";
import Polygon from "./Geometry/Polygon.js";
import Line from "./Geometry/Line.js";
import Circle from "./Geometry/Circle.js";
import Arrow from "./Geometry/Arrow.js";

export function createGeometry(room, geometryType, geometry, color) {
	let obj = null;
	switch (geometryType) {
		case "rectangle":
			obj = new Rectangle(
				room,
				geometry.x,
				geometry.y,
				geometry.w,
				geometry.h,
				color,
			);
			break;
		case "polygon":
			obj = new Polygon(room, geometry, color);
			break;
		case "line":
		case "polyline":
			obj = new Line(room, geometry, geometryType, color);
			break;
		case "circle":
			obj = new Circle(room, geometry.x, geometry.y, color);
			break;
		case "arrow":
			obj = new Arrow(room, geometry, color);
	}

	return obj;
}

export function createSidebar(room) {
	const existingAttributesDiv = document.getElementById("attributesDiv");
	if (existingAttributesDiv) {
		existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
	}
	const attributesDiv = document.createElement("div");
	attributesDiv.id = "attributesDiv";
	attributesDiv.classList.add("attributes", "md-3"); // This can be replaced or enhanced with Bootstrap classes if needed
	const roomForm = document.createElement("form");
	roomForm.id = "roomForm";
	roomForm.classList.add("row", "g-3"); // Adds grid with gutter

	room.attributes.forEach((value, key) => {
		const formGroup = document.createElement("div");
		formGroup.classList.add("mb-3"); // Adds margin bottom to each form group

		const label = document.createElement("label");
		const inputId = key.replace(/[^a-zA-Z0-9]/g, "_"); // Creating a safe id by replacing non-alphanumerics

		const input = document.createElement("input");
		input.classList.add("form-control"); // Bootstrap class for styling text inputs
		input.id = inputId;
		input.name = key;
		input.type = "text"; // Default to text, adjust as necessary
		input.value = value;

		label.htmlFor = inputId;
		label.textContent =
			key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ") + ":";
		label.classList.add("form-label"); // Bootstrap class for labels

		formGroup.appendChild(label);
		formGroup.appendChild(input);
		attributesDiv.appendChild(formGroup);
	});

	const addAttrBtn = document.createElement("button");
	addAttrBtn.type = "button";
	addAttrBtn.textContent = "Add Attribute";
	addAttrBtn.classList.add("btn", "btn-info", "mt-3", "mb-3");
	attributesDiv.appendChild(addAttrBtn);

	addAttrBtn.onclick = function () {
		showAttributeDropdown(attributesDiv); // Show dropdown to select new attribute
	};

	attributesDiv.appendChild(roomForm);

	room.geometry.createFormItems(roomForm);
	const formButton = document.createElement("button");
	formButton.type = "submit";
	formButton.id = "updateRoomDetailsBtn";
	formButton.classList.add("btn", "btn-primary", "mt-3"); // Bootstrap classes for buttons
	formButton.textContent = "Update";

	roomForm.appendChild(formButton);
	document.getElementById("sidebar").appendChild(attributesDiv);

	roomForm.addEventListener("submit", (event) => {
		event.preventDefault();

		// Update the selected room with the edited details
		const newAttributes = new Map();
		selectedRoom.attributes.forEach((value, key) => {
			const inputId = key.replace(/[^a-zA-Z0-9]/g, "_");
			const inputValue = document.getElementById(inputId).value;
			newAttributes.set(key, inputValue);
			// Assuming selectedRoom is an object that has methods or properties matching keys
			if (typeof selectedRoom[key] === "function") {
				selectedRoom[key](inputValue); // If it's a method, call it
			} else {
				selectedRoom[key] = inputValue; // Otherwise, set the property
			}
		});
		selectedRoom.attributes = newAttributes;
		selectedRoom.geometry.getFormData();
		selectedRoom.updateText();
	});
}

export function addAttributeField(form, key, value) {
	if (!selectedRoom.attributes.has(key)) {
		selectedRoom.attributes.set(key, value);
		selectedRoom.updateSidebar();
	}
}

export function showAttributeDropdown(form) {
	const dropdown = document.createElement("select");
	dropdown.classList.add("form-control", "mb-2");
	const options = [
		"id",
		"name",
		"number",
		"purpose",
		"important",
		"custom-map-label",
		"description",
		"custom-search-string",
		"capacity",
		"open",
	];
	options.forEach((option) => {
		const opt = document.createElement("option");
		opt.value = option;
		opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
		dropdown.appendChild(opt);
	});

	const addBtn = document.createElement("button");
	addBtn.textContent = "Add Selected Attribute";
	addBtn.classList.add("btn", "btn-success", "mt-2", "mb-2");
	addBtn.onclick = function () {
		const selectedOption = dropdown.value;
		addAttributeField(form, selectedOption, "");
		form.removeChild(dropdown); // Remove dropdown after adding
		form.removeChild(addBtn); // Remove button after adding
	};

	form.insertBefore(dropdown, form.lastChild);
	form.insertBefore(addBtn, form.lastChild);
}
