import {addRoom} from "./RectangularRoom.js";
import {addPolygonRoom} from "./PolygonRoom.js";
import {addDoor} from "./Door.js";

function toolbarClickFunc(element) {
    console.log(element.title)
    switch (element.title) {
        case "Create room":
            addRoom();
            break;
        case "Create doors":
            addPolygonRoom();
            break;
        case "Create elevators/stairs":
            addDoor();
            break;
    }
}

window.toolbarClickFunc = toolbarClickFunc;