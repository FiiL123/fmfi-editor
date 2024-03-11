// import { Konva } from './konva.min.js';
export default class RectangularRoom extends Konva.Rect {
    constructor(x, y, tr) {
        console.log(x+" "+y)
        super({
                x: x,
                y: y,
                width: 100,
                height: 90,
                fill: Konva.Util.getRandomColor(),
                name: 'rect',
                stroke: 'black',
                draggable: true,
            },
        );
        super.on('transformstart', function () {
            console.log('transform start');
        });

        super.on('dragmove', function () {
            // updateText();
            handleRoomClick(this)
        });
        super.on('transform', function () {
            // updateText();
            console.log('transform');
            handleRoomClick(this)
        });

        super.on('transformend', function () {
            console.log('transform end');
        });

        super.on('click', function () {
            console.log("klikikik")
            tr.nodes([this]);
            handleRoomClick(this)
        })
    }

}

export function addRoom(){
    var room = new RectangularRoom(100, 200,tr)
    layer.add(room)
}

function updateSidebar(room) {
    // Access the sidebar form elements
    const roomWidthInput = document.getElementById('roomWidth');
    const roomHeightInput = document.getElementById('roomHeight');
    const roomX = document.getElementById('roomX');
    const roomY = document.getElementById('roomY');


    // Update form fields with room details
    roomWidthInput.value = (room.width()*room.scaleX());
    roomHeightInput.value = (room.height()*room.scaleY());
    roomX.value = room.x()
    roomY.value = room.y()


    // Show the update button
    document.getElementById('updateRoomDetailsBtn').style.display = 'block';
}

// Function to handle the click event on RectangularRoom objects
function handleRoomClick(room) {
    // Store the selected room
    selectedRoom = room;

    // Update the sidebar with room details
    updateSidebar(selectedRoom);
}

document.getElementById('roomDetailsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Update the selected room with the edited details
    const newWidth = Number(document.getElementById('roomWidth').value)/selectedRoom.width();
    const newHeight = Number(document.getElementById('roomHeight').value)/selectedRoom.height();
    console.log(newWidth)
    selectedRoom.scaleX(newWidth);
    selectedRoom.scaleY(newHeight);
    selectedRoom.x(Number(document.getElementById('roomX').value));
    selectedRoom.y(Number(document.getElementById('roomX').value));

    // Hide the update button again
    document.getElementById('updateRoomDetailsBtn').style.display = 'none';
});