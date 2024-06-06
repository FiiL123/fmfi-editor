import { addDoor } from "./objects/Door.js";
import { addLift } from "./objects/Lift.js";
import { addRoom } from "./objects/Room.js";
import { exportPartXML } from "./XMLManager.js";
import { addStairs } from "./objects/Stairs.js";
import { addWall } from "./objects/Wall.js";
import { addFloor } from "./objects/Floor.js";
import { addVendingMachine } from "./objects/VendingMachine.js";
import { addArrow } from "./objects/ArrowObj.js";
import { addLabel } from "./objects/Label.js";
import { addVertex } from "./objects/Vertex.js";
import { addEdge } from "./objects/Edge.js";

function toolbarClickFunc(element) {
	console.log(element.title);
	console.log(stage.position());
	console.log(stage.scale());
	const x =
		-Math.floor(stage.position().x * stage.scale().x) + Math.floor(width / 2);
	const y =
		-Math.floor(stage.position().y * stage.scale().x) + Math.floor(height / 2);
	console.log(x);
	console.log(y);

	let attrs = new Map();
	switch (element.title) {
		case "Create room":
			addRoom(
				new Map(),
				layer,
				"rectangle",
				{ x: x, y: y, w: 100, h: 100 },
				part_scale,
			);
			break;
		case "Create floor":
			const f = addFloor(new Map(), layer, "rectangle", {
				x: x,
				y: y,
				w: 100,
				h: 100,
			});
			f.geometry.moveToBottom();
			break;
		case "Create doors":
			addDoor(new Map(), layer, "line", [x, y, x, y + 20]);
			break;
		case "Create wall":
			addWall(new Map(), layer, "line", [x, y, x, y + 20]);
			break;
		case "Create lift":
			addLift(new Map(), layer, "rectangle", { x: x, y: y, w: 30, h: 30 });
			break;
		case "Create stairs":
			addStairs(
				new Map(),
				layer,
				"polygon",
				[x, y, x + 20, y, x + 20, y + 20, x, y + 20],
				part_scale,
			);
			break;
		case "Create vending machine":
			addVendingMachine(new Map(), layer, "rectangle", {
				x: x,
				y: y,
				w: 100,
				h: 100,
			});
			break;
		case "Create arrow":
			addArrow(new Map(), layer, "arrow", [x, y, 10, y + 20]);
		case "Create label":
			attrs.set("text", "TEXT");
			attrs.set("x", `${x}`);
			attrs.set("y", `${y}`);
			addLabel(attrs, layer, part_scale);
			break;
			break;
		case "Create vertex":
			attrs.set("id", "id");
			attrs.set("x", `${x}`);
			attrs.set("y", `${y}`);
			addVertex(attrs, graphLayer, "arrow", [x, y, x, y + 20]);
			break;
		case "Create edge":
			const edgeId = prompt("Enter the ID for the edge:");
			if (edgeId === null) return; // User canceled the prompt
			const firstVertexId = prompt("Enter the ID for the first vertex:");
			if (firstVertexId === null) return; // User canceled the prompt
			const secondVertexId = prompt("Enter the ID for the second vertex:");
			if (secondVertexId === null) return; // User canceled the prompt

			attrs.set("id", edgeId);
			attrs.set("first-vertex-id", firstVertexId);
			attrs.set("second-vertex-id", secondVertexId);
			addEdge(attrs, graphLayer, "arrow", [x, y, x, y + 20]);
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
			document.getElementById("toolbar-plan").toggleAttribute("hidden");
			document.getElementById("toolbar-graph").toggleAttribute("hidden");
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
