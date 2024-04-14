import {addRoom} from "./RectangularRoom.js";
import {addPolygonRoom} from "./PolygonRoom.js";
import {addDoor} from "./Door.js";

function toolbarClickFunc(element) {
    console.log(element.title)
    switch (element.title) {
        case "Create rectangular room":
            addRoom();
            break;
        case "Create polygon room":
            addPolygonRoom();
            break;
        case "Create doors":
            addDoor();
            break;
    }
}

window.toolbarClickFunc = toolbarClickFunc;