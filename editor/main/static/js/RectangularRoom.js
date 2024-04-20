import {TransformAction} from "./Actions.js";

export default class RectangularRoom extends Konva.Rect {
    constructor(x, y, w, h, tr, id = "", number = "", color) {
        console.log(x+" "+y)
        color = (color === null) ? getRandomColor() : "rgb("+color+")";
        super({
                x: x,
                y: y,
                width: w,
                height: h,
                fill: color,
                stroke: 'black',
                draggable: true,
            },
        );
        this.id = id;
        this.number = number;
        super.on('transformstart', function () {
            console.log('transform start');
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
        });

        super.on('dragmove', function () {
            // updateText();
            this.handlePositionChange();
            handleRoomClick(this);
            this.updateTextPosition()
        });

        super.on('dragstart', function (){
            console.log("drag start");
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
        });
        super.on('dragend', function (){
            console.log("drag end");
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));
        });
        super.on('transform', function () {
            // updateText();
            console.log('transform');
            handleRoomClick(this);
            this.updateTextPosition();

        });

        super.on('transformend', function () {
            console.log('transform end');
            this.handlePositionChange();
            this.handleSizeChange();

            handleRoomClick(this);
            this.updateTextPosition();
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));

        });

        super.on('click', function () {
            console.log("klikikik")
            tr.nodes([this]);
            handleRoomClick(this)
        })

        this.numberText = new Konva.Text({
        text: this.number,
        x: x,
        y: y,
        fontSize: 16,
      });

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
    updateTextPosition(){
        let textX = this.x() + this.width() - this.numberText.width()-2; // Adjust for bottom right corner
        let textY = this.y() + this.height() - this.numberText.height(); // Adjust for bottom right corner
        this.numberText.position({ x: textX, y: textY });
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

    delete(){
        this.numberText.remove()
        tr.nodes([]);
    }

    ressurect(){
        layer.add(this);
        layer.add(this.numberText);
    }

    moveBack(prevX, prevY, prevW, prevH){
        this.x(prevX);
        this.y(prevY);
        this.width(prevW);
        this.height(prevH);
        this.updateTextPosition();
        updateSidebar(this);
    }

    lockDragging(){
        this.draggable(false)
    }
}

export function addRoom(x=100,y=90,w=100,h=100,id="test",number="test", color = null){
    var room = new RectangularRoom(x,y,w,h,tr, id, number, color)
    layer.add(room)
    room.updateTextPosition()
    layer.add(room.numberText)
    return(room);
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
    var rectRoomForm = document.createElement('form')
        rectRoomForm.id = "polygonRoomForm";


    var roomIDInput = document.createElement('input')
    roomIDInput.id = 'roomID'
    roomIDInput.type = 'text'
    roomIDInput.name = 'roomID'
    roomIDInput.value = (room.id);
    var roomIDLabel = document.createElement('label')
    roomIDLabel.for = 'RoomID'
    roomIDLabel.textContent = 'ID:'
    rectRoomForm.appendChild(roomIDLabel)
    rectRoomForm.appendChild(roomIDInput)

    var roomNumberInput = document.createElement('input')
    roomNumberInput.id = 'roomNumber'
    roomNumberInput.type = 'text'
    roomNumberInput.name = 'roomNumber'
    roomNumberInput.value = (room.number);
    var roomNumberLabel = document.createElement('label')
    roomNumberLabel.for = 'roomNumber'
    roomNumberLabel.textContent = 'Number:'
    rectRoomForm.appendChild(roomNumberLabel)
    rectRoomForm.appendChild(roomNumberInput)

    var roomWidthInput = document.createElement('input')
    roomWidthInput.id = 'roomWidth'
    roomWidthInput.type = 'number'
    roomWidthInput.name = 'roomWidth'
    var roomWidthLabel = document.createElement('label')
    roomWidthLabel.for = 'roomWidth'
    roomWidthLabel.textContent = 'Width:'
    rectRoomForm.appendChild(roomWidthLabel)
    roomWidthInput.value = (room.width() * room.scaleX());

    rectRoomForm.appendChild(roomWidthInput)

    var roomHeightInput = document.createElement('input')
    roomHeightInput.id = 'roomHeight'
    roomHeightInput.type = 'number'
    roomHeightInput.name = 'roomHeight'
    roomHeightInput.value = (room.height() * room.scaleY());
    var roomHeightLabel = document.createElement('label')
    roomHeightLabel.for = 'roomHeight'
    roomHeightLabel.textContent = 'Height:'
    rectRoomForm.appendChild(roomHeightLabel)
    rectRoomForm.appendChild(roomHeightInput)

    var roomXInput = document.createElement('input')
    roomXInput.id = 'roomX'
    roomXInput.type = 'number'
    roomXInput.name = 'roomX'
    roomXInput.value = room.x();
    var roomXLabel = document.createElement('label')
    roomXLabel.for = 'roomX'
    roomXLabel.textContent = 'X:'
    rectRoomForm.appendChild(roomXLabel)
    rectRoomForm.appendChild(roomXInput)

    var roomYInput = document.createElement('input')
    roomYInput.id = 'roomY'
    roomYInput.type = 'number'
    roomYInput.name = 'roomY'
    roomYInput.value = room.y();
    var roomYLabel = document.createElement('label')
    roomYLabel.for = 'roomY'
    roomYLabel.textContent = 'Y:'
    rectRoomForm.appendChild(roomYLabel)
    rectRoomForm.appendChild(roomYInput)


    var formButton = document.createElement('button')
    formButton.type='submit'
    formButton.id='updateRoomDetailsBtn'
    formButton.style.display = 'block'
    formButton.textContent='Update'
    attributesDiv.appendChild(rectRoomForm)
    rectRoomForm.appendChild(formButton)
    document.getElementById('sidebar').appendChild(attributesDiv)

    rectRoomForm.addEventListener('submit', listener)

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


function listener(event){
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
    selectedRoom.numberText.text(newNumber);
    selectedRoom.updateTextPosition()
}
