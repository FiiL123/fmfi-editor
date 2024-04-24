import {TransformAction} from "../../Actions.js";

export default class Rectangle extends Konva.Rect {
    constructor(room, x, y, w, h, color) {
        super({
            x: x,
            y: y,
            width: w,
            height: h,
            fill: color,
            stroke: 'black',
            draggable: true,
        });
        this.room = room
        super.on('transformstart', function () {
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
            this.handleRoomClick();
        });

        super.on('dragmove', function () {
            this.handlePositionChange();
            this.room.updateText();
        });

        super.on('dragstart', function () {
            this.prevX = this.x()
            this.prevY = this.y()
            this.prevW = this.width()
            this.prevH = this.height()
            this.handleRoomClick();

        });
        super.on('dragend', function () {
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));
        });
        super.on('transform', function () {
            this.room.updateText();

        });

        super.on('transformend', function () {
            this.handlePositionChange();
            this.handleSizeChange();
            this.room.updateSidebar();
            this.room.updateText();
            actionManager.addAction(new TransformAction(this, this.prevX, this.prevY, this.prevW, this.prevH));

        });

        super.on('click', this.handleRoomClick);
    }

    handleRoomClick(){
        selectedRoom = this.room;
        tr.nodes([this]);
        this.room.updateSidebar()
    }

    handlePositionChange(){
        this.x(Math.floor(this.x()));
        this.y(Math.floor(this.y()));
    }

    handleSizeChange(){
        let roomWidth = Math.floor(this.width()*this.scaleX());
        let roomHeight = Math.floor(this.height()*this.scaleY());
        this.scaleX(1)
        this.scaleY(1)
        this.width(roomWidth);
        this.height(roomHeight);
    }

    getLabelPoint(){
        return {x:this.x(), y: this.y()}
    }

    createFormItems(elemtent){
        var roomWidthInput = document.createElement('input')
        roomWidthInput.id = 'roomWidth'
        roomWidthInput.type = 'number'
        roomWidthInput.name = 'roomWidth'
        var roomWidthLabel = document.createElement('label')
        roomWidthLabel.for = 'roomWidth'
        roomWidthLabel.textContent = 'Width:'
        elemtent.appendChild(roomWidthLabel)
        roomWidthInput.value = (this.width() * this.scaleX());

        elemtent.appendChild(roomWidthInput)

        var roomHeightInput = document.createElement('input')
        roomHeightInput.id = 'roomHeight'
        roomHeightInput.type = 'number'
        roomHeightInput.name = 'roomHeight'
        roomHeightInput.value = (this.height() * this.scaleY());
        var roomHeightLabel = document.createElement('label')
        roomHeightLabel.for = 'roomHeight'
        roomHeightLabel.textContent = 'Height:'
        elemtent.appendChild(roomHeightLabel)
        elemtent.appendChild(roomHeightInput)

        var roomXInput = document.createElement('input')
        roomXInput.id = 'roomX'
        roomXInput.type = 'number'
        roomXInput.name = 'roomX'
        roomXInput.value = this.x();
        var roomXLabel = document.createElement('label')
        roomXLabel.for = 'roomX'
        roomXLabel.textContent = 'X:'
        elemtent.appendChild(roomXLabel)
        elemtent.appendChild(roomXInput)

        var roomYInput = document.createElement('input')
        roomYInput.id = 'roomY'
        roomYInput.type = 'number'
        roomYInput.name = 'roomY'
        roomYInput.value = this.y();
        var roomYLabel = document.createElement('label')
        roomYLabel.for = 'roomY'
        roomYLabel.textContent = 'Y:'
        elemtent.appendChild(roomYLabel)
        elemtent.appendChild(roomYInput)
    }

    getFormData(){
        const newWidth = Math.floor(Number(document.getElementById('roomWidth').value));
        const newHeight = Math.floor(Number(document.getElementById('roomHeight').value));
        const newX = Math.floor(Number(document.getElementById('roomX').value));
        const newY = Math.floor(Number(document.getElementById('roomY').value));

        selectedRoom.width(newWidth);
        selectedRoom.height(newHeight);
        selectedRoom.x(newX);
        selectedRoom.y(newY);
    }

    toString(){
        return "Rectangle("+this.x+","+this.y+")"
    }

    moveBack(prev){
        this.x(prev.x);
        this.y(prev.y);
        this.width(prev.w);
        this.height(prev.h);
        this.room.updateSidebar()
        this.room.updateText()
    }
}