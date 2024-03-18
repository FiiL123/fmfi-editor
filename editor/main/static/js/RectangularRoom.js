// import { Konva } from './konva.min.js';
export default class RectangularRoom extends Konva.Rect {
    constructor(x, y, tr, id="", number="") {
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
        this.id = id;
        this.number = number;
        super.on('transformstart', function () {
            console.log('transform start');
        });

        super.on('dragmove', function () {
            // updateText();
            this.handlePositionChange();
            handleRoomClick(this);
        });
        super.on('transform', function () {
            // updateText();
            console.log('transform');

            this.handleSizeChange();
            handleRoomClick(this);
        });

        super.on('transformend', function () {
            console.log('transform end');
            this.handlePositionChange();
            handleRoomClick(this);

        });

        super.on('click', function () {
            console.log("klikikik")
            tr.nodes([this]);
            handleRoomClick(this)
        })
    }
    toString(){
        return `RectRoom(${this.x()}-${this.y()})`
    }
    handlePositionChange(){
        let intersectObj = this.isIntersecting();
        if (intersectObj === null){
            let roomX = Math.floor(this.x());
            let roomY = Math.floor(this.y());
            this.x(roomX);
            this.y(roomY);
        }
        else {
            let snapDistance = Math.sqrt((Math.pow(this.width(),2)+Math.pow(this.height(),2)))/4; // Adjust this value as needed for your snapping sensitivity, 1/4 of the diagonal
            console.log("snp dist:" + snapDistance);
            // Snap horizontally
            if (Math.abs(this.y() + this.height() / 2 - intersectObj.y() - intersectObj.height() / 2) < snapDistance) {
                if (this.x() + this.width() < intersectObj.x() + snapDistance) {
                    this.x(intersectObj.x() - this.width());
                } else if (this.x() > intersectObj.x() + intersectObj.width() - snapDistance) {
                    this.x(intersectObj.x() + intersectObj.width());
                }
            }

            // Snap vertically
            if (Math.abs(this.x() + this.width() / 2 - intersectObj.x() - intersectObj.width() / 2) < snapDistance) {
                if (this.y() + this.height() < intersectObj.y() + snapDistance) {
                    this.y(intersectObj.y() - this.height());
                } else if (this.y() > intersectObj.y() + intersectObj.height() - snapDistance) {
                    this.y(intersectObj.y() + intersectObj.height());
                }
            }


    }
}

    handleSizeChange(){
        let roomWidth = Math.floor(this.width()*this.scaleX());
        let roomHeight = Math.floor(this.height()*this.scaleY());
        this.scaleX(1)
        this.scaleY(1)
        this.width(roomWidth);
        this.height(roomHeight);
    }

    isIntersecting() {
        let layer = this.getLayer();
        let children = layer.getChildren();
        for (const obj of children) {
            if ((obj instanceof RectangularRoom) && haveIntersection(this, obj) && !(this === obj)) {
                console.log("Overlap:" + this + " - > " + obj);
                return obj;
            }
        }
        return null;
    }
}

export function addRoom(){
    var room = new RectangularRoom(100, 200,tr)
    layer.add(room)
}

function updateSidebar(room) {
    // Access the sidebar form elements
    var existingAttributesDiv = document.getElementById('attributesDiv');
    if (existingAttributesDiv) {
        existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
    }
    var attributesDiv = document.createElement('div');
    attributesDiv.id = 'attributesDiv';
    attributesDiv.classList.add('attributes'); // You can add CSS classes for styling

    var roomIDInput = document.createElement('input')
    roomIDInput.id = 'roomID'
    roomIDInput.type = 'text'
    roomIDInput.name = 'roomID'
    roomIDInput.value = (room.id);
    var roomIDLabel = document.createElement('label')
    roomIDLabel.for = 'RoomID'
    roomIDLabel.textContent = 'ID:'
    attributesDiv.appendChild(roomIDLabel)
    attributesDiv.appendChild(roomIDInput)

    var roomNumberInput = document.createElement('input')
    roomNumberInput.id = 'roomNumber'
    roomNumberInput.type = 'text'
    roomNumberInput.name = 'roomNumber'
    roomNumberInput.value = (room.number);
    var roomNumberLabel = document.createElement('label')
    roomNumberLabel.for = 'roomNumber'
    roomNumberLabel.textContent = 'Number:'
    attributesDiv.appendChild(roomNumberLabel)
    attributesDiv.appendChild(roomNumberInput)

    var roomWidthInput = document.createElement('input')
    roomWidthInput.id = 'roomWidth'
    roomWidthInput.type = 'number'
    roomWidthInput.name = 'roomWidth'
    var roomWidthLabel = document.createElement('label')
    roomWidthLabel.for = 'roomWidth'
    roomWidthLabel.textContent = 'Width:'
    attributesDiv.appendChild(roomWidthLabel)
    roomWidthInput.value = (room.width() * room.scaleX());

    attributesDiv.appendChild(roomWidthInput)

    var roomHeightInput = document.createElement('input')
    roomHeightInput.id = 'roomHeight'
    roomHeightInput.type = 'number'
    roomHeightInput.name = 'roomHeight'
    roomHeightInput.value = (room.height() * room.scaleY());
    var roomHeightLabel = document.createElement('label')
    roomHeightLabel.for = 'roomHeight'
    roomHeightLabel.textContent = 'Height:'
    attributesDiv.appendChild(roomHeightLabel)
    attributesDiv.appendChild(roomHeightInput)

    var roomXInput = document.createElement('input')
    roomXInput.id = 'roomX'
    roomXInput.type = 'number'
    roomXInput.name = 'roomX'
    roomXInput.value = room.x();
    var roomXLabel = document.createElement('label')
    roomXLabel.for = 'roomX'
    roomXLabel.textContent = 'X:'
    attributesDiv.appendChild(roomXLabel)
    attributesDiv.appendChild(roomXInput)

    var roomYInput = document.createElement('input')
    roomYInput.id = 'roomY'
    roomYInput.type = 'number'
    roomYInput.name = 'roomY'
    roomYInput.value = room.y();
    var roomYLabel = document.createElement('label')
    roomYLabel.for = 'roomY'
    roomYLabel.textContent = 'Y:'
    attributesDiv.appendChild(roomYLabel)
    attributesDiv.appendChild(roomYInput)

    var form = document.getElementById("roomDetailsForm");

    var formButton = document.createElement('button')
    formButton.type='submit'
    formButton.id='updateRoomDetailsBtn'
    formButton.style.display = 'block'
    formButton.textContent='Update'
    attributesDiv.appendChild(formButton)
    form.appendChild(attributesDiv)

}

// Function to handle the click event on RectangularRoom objects
function handleRoomClick(room) {
    // Store the selected room
    selectedRoom = room;

    // Update the sidebar with room details
    updateSidebar(selectedRoom);
}

function haveIntersection(r1, r2) {
        return !(
          r2.x() > r1.x() + r1.width() ||
          r2.x() + r2.width() < r1.x() ||
          r2.y() > r1.y() + r1.height() ||
          r2.y() + r2.height() < r1.y()
        );
      }



document.getElementById('roomDetailsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Update the selected room with the edited details
    const newID = document.getElementById('roomID').value;
    const newNumber = document.getElementById('roomNumber').value;
    const newWidth = Math.floor(Number(document.getElementById('roomWidth').value));
    const newHeight = Math.floor(Number(document.getElementById('roomHeight').value));
    const newX = Math.floor(Number(document.getElementById('roomX').value));
    const newY = Math.floor(Number(document.getElementById('roomY').value));

    selectedRoom.id = newID;
    selectedRoom.number = newNumber;
    selectedRoom.width(newWidth);
    selectedRoom.height(newHeight);
    selectedRoom.x(newX);
    selectedRoom.y(newY);
    


});