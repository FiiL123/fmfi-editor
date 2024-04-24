import { DeleteAction } from "./Actions.js";

document.addEventListener("keydown", (event) => {
	if (event.key === "Delete") {
		// Find the selected object and remove it
		console.log("delettttin");
		if (selectedRoom) {
			const action = new DeleteAction(selectedRoom);
			actionManager.addAction(action);
			action.make();
			layer.draw();
		}
	}
	if (event.key === "Escape") {
		tr.nodes([]);
		selectedRoom = null;
		var existingAttributesDiv = document.getElementById("attributesDiv");
		if (existingAttributesDiv) {
			existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
		}
	}
});

// TODO applove klavesove
document.addEventListener("keydown", (event) => {
	// Check if CTRL key is pressed and Z key is pressed
	if (event.ctrlKey && event.key === "z") {
		// Perform your action here, such as undoing an action
		console.log("CTRL+Z pressed");
		actionManager.revertLastAction();
	}
});
