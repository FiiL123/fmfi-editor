import { addDoor } from "./objects/Door.js";
import { addLift } from "./objects/Lift.js";
import { addRoom } from "./objects/Room.js";
import { exportPartXML } from "./XMLManager.js";

function toolbarClickFunc(element) {
	console.log(element.title);
	switch (element.title) {
		case "Create rectangular room":
			addRoom(new Map(), "rectangle", { x: 10, y: 10, w: 100, h: 100 });
			break;
		case "Create polygon room":
			addRoom(new Map(), "polygon", [200, 200, 100, 200, 100, 100, 200, 100]);
			break;
		case "Create doors":
			addDoor();
			break;
		case "Create lift/stairs":
			addLift();
			break;
		case "Toggle plan view":
			if (bottom_layer.visible()) {
				bottom_layer.visible(false);
				layer.opacity(1);
				element.classList.replace("btn-primary", "btn-secondary");
			} else {
				bottom_layer.visible(true);
				layer.opacity(0.7);
				element.classList.replace("btn-secondary", "btn-primary");
			}
			break;
		case "Toggle graph view":
			if (graphLayer.visible()) {
				graphLayer.visible(false);
				layer.opacity(1);
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

window.toolbarClickFunc = toolbarClickFunc;
