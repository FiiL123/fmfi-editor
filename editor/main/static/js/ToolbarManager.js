import { addDoor } from "./objects/Door.js";
import { addLift } from "./objects/Lift.js";
import { addRoom } from "./objects/Room.js";
import { exportPartXML } from "./XMLManager.js";

function toolbarClickFunc(element) {
	console.log(element.title);
	switch (element.title) {
		case "Create rectangular room":
			addRoom(new Map(), layer, "rectangle", { x: 10, y: 10, w: 100, h: 100 });
			break;
		case "Create polygon room":
			addRoom(
				new Map(),
				layer,
				"polygon",
				[200, 200, 100, 200, 100, 100, 200, 100],
			);
			break;
		case "Create doors":
			addDoor(new Map(), layer, "line", [10, 10, 10, 20]);
			break;
		case "Create lift/stairs":
			addLift(new Map(), layer, "rectangle", { x: 10, y: 10, w: 15, h: 15 });
			break;
		case "Toggle plan view":
			if (bottom_layer) {
				if (bottom_layer.visible()) {
					bottom_layer.visible(false);
					layer.opacity(1);
					element.classList.replace("btn-primary", "btn-secondary");
				} else {
					bottom_layer.visible(true);
					layer.opacity(0.7);
					element.classList.replace("btn-secondary", "btn-primary");
				}
			}
			break;
		case "Toggle graph view":
			if (graphLayer.visible()) {
				graphLayer.visible(false);
				if (!bottom_layer || !bottom_layer.visible()) layer.opacity(1);
				layer.listening(true);
				element.classList.replace("btn-primary", "btn-secondary");
			} else {
				graphLayer.visible(true);
				layer.opacity(0.7);
				layer.listening(false);
				element.classList.replace("btn-secondary", "btn-primary");
			}
			break;
		case "Save changes":
			exportPartXML();
	}
}

function homeToolbarClickFunc(element) {
	console.log(element.title);
	switch (element.title) {
		case "Level up":
			prevLevel = selectedLevel;
			selectedLevel += 1;
			changeLevel();
			break;
		case "Level down":
			prevLevel = selectedLevel;
			selectedLevel -= 1;
			changeLevel();
			break;
	}
	console.log(selectedLevel);
}

window.toolbarClickFunc = toolbarClickFunc;
window.homeToolbarClickFunc = homeToolbarClickFunc;

function changeLevel() {
	document.getElementById("level-label").textContent = selectedLevel;
	for (let [key, value] of parts.entries()) {
		if (value.level === prevLevel || value.level === selectedLevel) {
			document.getElementById("part_div-" + key).toggleAttribute("hidden");
		}
	}
	renderParts();
}
