import {addRoom} from "./RectangularRoom.js";
import {addPolygonRoom} from "./PolygonRoom.js";

function toolbarClickFunc(element) {
    switch (element.title) {
        case "Create room":
            addRoom();
            break;
        case "Create doors":
            addPolygonRoom();
            break;
    }
}

window.toolbarClickFunc = toolbarClickFunc;