import {TransformAction} from "./Actions.js";

export default class PolygonRoom extends Konva.Line {
    constructor(points, id="", number="") {
        super({
                points: points,
                fill: Konva.Util.getRandomColor(),
                stroke: 'black',
                closed: true,
                draggable: true,
            },
        );
        this.startingPoints = points;
        this.id = id;
        this.number = number;

        super.on('click', function () {
            selectedRoom = this;
            tr.nodes([this]);
            this.updateSidebar();
        });
        super.on('dragmove', function () {

        })
        super.on('dragstart', function () {


        })
        super.on('dragend', function () {
            this.updatePosition()
            this.updateSidebar()
        })


    }

    updatePosition(){
        let points = this.points()
        for (let i = 0; i < points.length; i++) {
            if (i%2===0){
                points[i]= Math.floor(this.startingPoints[i] + this.x())
            }
            else{
                points[i]= Math.floor(this.startingPoints[i] + this.y())
            }
        }
        this.x(0)
        this.y(0)
        this.points(points)
    }

    updateSidebar(){
        // Access the sidebar form elements
        var existingAttributesDiv = document.getElementById('attributesDiv');
        if (existingAttributesDiv) {
            existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
        }
        var attributesDiv = document.createElement('div');
        attributesDiv.id = 'attributesDiv';
        attributesDiv.classList.add('attributes');
        var polygonRoomForm = document.createElement('form')
        polygonRoomForm.id = "polygonRoomForm";

        var roomIDInput = document.createElement('input')
        roomIDInput.id = 'roomID'
        roomIDInput.type = 'text'
        roomIDInput.name = 'roomID'
        roomIDInput.value = (this.id);
        var roomIDLabel = document.createElement('label')
        roomIDLabel.for = 'RoomID'
        roomIDLabel.textContent = 'ID:'
        polygonRoomForm.appendChild(roomIDLabel)
        polygonRoomForm.appendChild(roomIDInput)

        var roomNumberInput = document.createElement('input')
        roomNumberInput.id = 'roomNumber'
        roomNumberInput.type = 'text'
        roomNumberInput.name = 'roomNumber'
        roomNumberInput.value = (this.number);
        var roomNumberLabel = document.createElement('label')
        roomNumberLabel.for = 'roomNumber'
        roomNumberLabel.textContent = 'Number:'
        polygonRoomForm.appendChild(roomNumberLabel)
        polygonRoomForm.appendChild(roomNumberInput)


        this.makePointForm(polygonRoomForm)





        var formButton = document.createElement('button')
        formButton.type='submit'
        formButton.id='updateRoomDetailsBtn'
        formButton.style.display = 'block'
        formButton.textContent='Update'
        attributesDiv.appendChild(polygonRoomForm)
        polygonRoomForm.appendChild(formButton)
        document.getElementById('sidebar').appendChild(attributesDiv)

        polygonRoomForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("UPDATEEEE")
            // Update the selected room with the edited details
            const newID = document.getElementById('roomID').value;
            const newNumber = document.getElementById('roomNumber').value;


            selectedRoom.id = newID;
            selectedRoom.number = newNumber;


        });
    }

    makePointForm(mainDiv){
        var pointsDiv = document.createElement('div');
        pointsDiv.id = 'pointsDiv';
        pointsDiv.classList.add('attributes');
        let points = this.points()
        console.log(points)
        for (let i = 0; i < points.length; ++i) {
            if (i%2===0){
                const pointLabel = document.createElement('label')
                pointLabel.for = 'pointXInput'+i
                pointLabel.textContent = 'Point('+i/2+'):'
                const pointXInput = document.createElement('input');
                pointXInput.type='number'
                pointXInput.size = 5;
                pointXInput.value = points[i]
                pointsDiv.appendChild(pointLabel)
                pointsDiv.appendChild(pointXInput)
            }
            else{
                const pointYInput = document.createElement('input');
                pointYInput.type='number'
                pointYInput.size = 5;
                pointYInput.value = points[i]
                pointsDiv.appendChild(pointYInput)

            }
        }


        mainDiv.appendChild(pointsDiv);
    }
}




export function addPolygonRoom(){
    var room = new PolygonRoom([23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93], "polygon","WC")
    layer.add(room);
}
