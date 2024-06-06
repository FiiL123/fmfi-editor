import { DeleteAction } from "./Actions.js";

document.addEventListener("keydown", (event) => {
	if (event.key === "Delete") {
		// Find the selected object and remove it
		if (selectedRoom) {
			const action = new DeleteAction(selectedRoom);
			actionManager.addAction(action);
			action.make();
			layer.draw();
			const existingAttributesDiv = document.getElementById("attributesDiv");
			if (existingAttributesDiv) {
				existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
			}
		}
	}
	if (event.key === "Escape") {
		tr.nodes([]);
		selectedRoom = null;
		const existingAttributesDiv = document.getElementById("attributesDiv");
		if (existingAttributesDiv) {
			existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
		}
	}
});

document.addEventListener("keydown", (event) => {
	// Check if CTRL key is pressed and Z key is pressed
	if ((event.ctrlKey || event.metaKey) && event.key === "z") {
		// Perform your action here, such as undoing an action
		actionManager.undoLastAction();
	}
});

document.addEventListener("keydown", (event) => {
	// Check if CTRL key is pressed and Z key is pressed
	if ((event.ctrlKey || event.metaKey) && event.key === "y") {
		// Perform your action here, such as undoing an action
		actionManager.redoLastAction();
	}
});

document.addEventListener("contextmenu", function (event) {
	event.preventDefault();
});
