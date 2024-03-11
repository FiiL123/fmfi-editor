import {addRoom} from "./RectangularRoom.js";

function toolbarClickFunc(element) {
    switch (element.title) {
        case "Create room":
            addRoom();
            break;
    }
}

window.toolbarClickFunc = toolbarClickFunc;