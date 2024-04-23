import {addRoom} from "./objects/RectangularRoom.js";
import {addPolygonRoom} from "./objects/PolygonRoom.js";
import {addDoor} from "./objects/Door.js";
import {addLift} from "./objects/Lift.js";

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
        case "Create lift/stairs":
            addLift();
            break;
        case "Toggle plan view":
            if (bottom_layer.visible()){
                console.log("is visible")
                bottom_layer.visible(false);
                layer.opacity(1);
            }else{
                bottom_layer.visible(true);
                layer.opacity(0.7);
            }
            break;
    }
}

window.toolbarClickFunc = toolbarClickFunc;