import {TransformAction} from "../Actions.js";

export default class Lift extends Konva.Rect{
    constructor(x, y, w, h, tr, attributes = new Map()) {
        super({
                x: x,
                y: y,
                width: w,
                height: h,
                fill: 'blue',
                stroke: 'black',
                draggable: true,
            },
        );
        this.attributes = attributes;
        this.id = (attributes.has('id')) ? attributes.get('id'): "";

        super.on('dragstart', function (){
            console.log("drag start");
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
            this.handleClick();

        });

        super.on('dragmove', function () {
            // updateText();
            this.handlePositionChange();
        });

        super.on('dragend', function (){
            console.log("drag end");
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));
        });


        super.on('transformstart', function () {
            console.log('transform start');
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
            this.handleClick();
        });

        super.on('transformend', function () {
            console.log('transform end');
            this.handlePositionChange();
            this.handleSizeChange();
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));

        });

        super.on('click', this.handleClick);

    }
    toString(){
        return `Lift(${this.x()}-${this.y()})`
    }

    handleClick(){
        selectedRoom = this;
        tr.nodes([this]);
        this.updateSidebar()
    }

    handlePositionChange(){
        let x = Math.floor(this.x());
        let y = Math.floor(this.y());
        this.x(x);
        this.y(y);
    }

    handleSizeChange(){
        let w = Math.floor(this.width()*this.scaleX());
        let h = Math.floor(this.height()*this.scaleY());
        this.scaleX(1)
        this.scaleY(1)
        this.width(w);
        this.height(h);
    }

    updateSidebar() {
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
        roomIDInput.value = (this.id);
        var roomIDLabel = document.createElement('label')
        roomIDLabel.for = 'RoomID'
        roomIDLabel.textContent = 'ID:'
        rectRoomForm.appendChild(roomIDLabel)
        rectRoomForm.appendChild(roomIDInput)

        var roomWidthInput = document.createElement('input')
        roomWidthInput.id = 'roomWidth'
        roomWidthInput.type = 'number'
        roomWidthInput.name = 'roomWidth'
        var roomWidthLabel = document.createElement('label')
        roomWidthLabel.for = 'roomWidth'
        roomWidthLabel.textContent = 'Width:'
        rectRoomForm.appendChild(roomWidthLabel)
        roomWidthInput.value = (this.width() * this.scaleX());

        rectRoomForm.appendChild(roomWidthInput)

        var roomHeightInput = document.createElement('input')
        roomHeightInput.id = 'roomHeight'
        roomHeightInput.type = 'number'
        roomHeightInput.name = 'roomHeight'
        roomHeightInput.value = (this.height() * this.scaleY());
        var roomHeightLabel = document.createElement('label')
        roomHeightLabel.for = 'roomHeight'
        roomHeightLabel.textContent = 'Height:'
        rectRoomForm.appendChild(roomHeightLabel)
        rectRoomForm.appendChild(roomHeightInput)

        var roomXInput = document.createElement('input')
        roomXInput.id = 'roomX'
        roomXInput.type = 'number'
        roomXInput.name = 'roomX'
        roomXInput.value = this.x();
        var roomXLabel = document.createElement('label')
        roomXLabel.for = 'roomX'
        roomXLabel.textContent = 'X:'
        rectRoomForm.appendChild(roomXLabel)
        rectRoomForm.appendChild(roomXInput)

        var roomYInput = document.createElement('input')
        roomYInput.id = 'roomY'
        roomYInput.type = 'number'
        roomYInput.name = 'roomY'
        roomYInput.value = this.y();
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

        rectRoomForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const newID = document.getElementById('roomID').value;
            const newWidth = Math.floor(Number(document.getElementById('roomWidth').value));
            const newHeight = Math.floor(Number(document.getElementById('roomHeight').value));
            const newX = Math.floor(Number(document.getElementById('roomX').value));
            const newY = Math.floor(Number(document.getElementById('roomY').value));

            selectedRoom.id = newID;
            selectedRoom.width(newWidth);
            selectedRoom.height(newHeight);
            selectedRoom.x(newX);
            selectedRoom.y(newY);
        })

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
        this.updateSidebar();
    }

    lockDragging(){
        this.draggable(false)
    }
}

export function addLift(x=100,y=90,w=100,h=100,attributes = new Map()){
    const lift = new Lift(x, y, w, h, tr, attributes);
    layer.add(lift)
    return(lift);
}