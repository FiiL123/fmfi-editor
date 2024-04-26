import Polygon from "./Geometry/Polygon.js";
import Rectangle from "./Geometry/Rectangle.js";

export default class Room {
	constructor(attributes, geometryType, geometry) {
		const purpose = purposesData.find(
			(purpose) => purpose.pk === attributes.get("purpose"),
		);
		this.color = getRandomColor();
		if (attributes.size > 0) {
			this.color =
				purpose && purpose.fields.colour !== ""
					? "rgb(" + purpose.fields.colour + ")"
					: "lightgray";
			if (attributes.get("id").startsWith("f-")) this.color = "white";
		}
		this.attributes = attributes;
		this.id = attributes.has("id") ? attributes.get("id") : "";
		this.number = attributes.has("number") ? attributes.get("number") : "";
		this.geometry = this.createGeometry(geometryType, geometry);
		layer.add(this.geometry);

		// TODO velkost fontu na zaklade skaly partu?
		this.text = attributes.has("custom-map-label")
			? attributes.get("custom-map-label")
			: this.number;
		this.text = this.text.replace("\\n", "\n");

		const textPosition = this.geometry.getLabelPoint();
		this.numberText = new Konva.Text({
			text: this.text,
			x: textPosition.x + 2,
			y: textPosition.y + 2,
			fontSize: attributes.has("important") ? 30 : 24,
		});
		layer.add(this.numberText);
	}

	createGeometry(geometryType, geometry) {
		let obj = null;
		switch (geometryType) {
			case "rectangle":
				obj = new Rectangle(
					this,
					geometry.x,
					geometry.y,
					geometry.w,
					geometry.h,
					this.color,
				);
				break;
			case "polygon":
				obj = new Polygon(this, geometry, this.color);
		}

		return obj;
	}

	updateSidebar() {
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

		this.attributes.forEach((value, key) => {
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
			selectedRoom.showAttributeDropdown(attributesDiv); // Show dropdown to select new attribute
		};

		attributesDiv.appendChild(roomForm);

		this.geometry.createFormItems(roomForm); // Ensure this method also uses Bootstrap styles
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

	addAttributeField(form, key, value) {
		if (!selectedRoom.attributes.has(key)) {
			selectedRoom.attributes.set(key, value);
			selectedRoom.updateSidebar();
		}
	}

	showAttributeDropdown(form) {
		const dropdown = document.createElement("select");
		dropdown.classList.add("form-control", "mb-2");
		const options = ["name", "number", "purpose", "important"];
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
			selectedRoom.addAttributeField(form, selectedOption, "");
			form.removeChild(dropdown); // Remove dropdown after adding
			form.removeChild(addBtn); // Remove button after adding
		};

		form.insertBefore(dropdown, form.lastChild);
		form.insertBefore(addBtn, form.lastChild);
	}

	updateText() {
		this.numberText.text(
			this.attributes.has("custom-map-label")
				? this.attributes.get("custom-map-label")
				: this.number,
		);
		const textPosition = this.geometry.getLabelPoint();
		this.numberText.position({ x: textPosition.x, y: textPosition.y });
	}

	delete() {
		this.numberText.remove();
		this.geometry.remove();
		tr.nodes([]);
	}

	ressurect() {
		// TODO if floor, move to bottom
		layer.add(this.geometry);
		layer.add(this.numberText);
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
		this.draggable(false);
	}
	toXML(doc, parent) {
		const roomElem = doc.createElement("room");
		this.attributes.forEach((val, key) => {
			roomElem.setAttribute(key, val);
		});
		this.geometry.toXML(doc, roomElem);
		console.log(roomElem);
		parent.appendChild(roomElem);
	}
}

export function addRoom(attributes, geometryType, geometry) {
	const room = new Room(attributes, geometryType, geometry);
	objects.push(room);
	return room;
}
