import {DeleteAction} from "./Actions.js";

document.addEventListener("keydown", function(event) {
  if (event.key === "Backspace" || event.key === "Delete") {
    // Find the selected object and remove it
      console.log("delettttin");
    if (selectedRoom) {
        let action = new DeleteAction(selectedRoom);
        action.make();
        layer.draw();
    }
  }
});