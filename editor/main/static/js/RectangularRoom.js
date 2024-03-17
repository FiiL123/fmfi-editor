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
            let snapDistance = Math.sqrt((Math.pow(this.width(),2)+Math.pow(this.height(),2))/4); // Adjust this value as needed for your snapping sensitivity, 1/4 of the diagonal

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

function haveIntersection(r1, r2) {
        return !(
          r2.x() > r1.x() + r1.width() ||
          r2.x() + r2.width() < r1.x() ||
          r2.y() > r1.y() + r1.height() ||
          r2.y() + r2.height() < r1.y()
        );
      }