import {TransformPolyAction} from "../Actions.js";

export default class Door extends Konva.Line {
    constructor(points, id = "") {
        super({
                points: points,
                stroke: 'red',
                draggable: true,
            },
        );
        this.startingPoints = points;
        this.id = id;

        super.on('click', this.handleRoomClick);
        super.on('dragmove', function () {

        })
        super.on('dragstart', function () {
            this.prevPoints = [...this.points()]
            this.handleRoomClick()
        })
        super.on('dragend', function () {
            this.updatePosition()
            this.updateSidebar()
            actionManager.addAction(new TransformPolyAction(this, this.prevPoints));

        })

        super.on('transformstart', function () {
            this.prevPoints = [...this.points()]
            this.handleRoomClick()
        })
        super.on('transformend', function () {
            this.updateScale()
            this.updatePosition()
            this.updateSidebar()
            actionManager.addAction(new TransformPolyAction(this, this.prevPoints));

        })


    }
    updateSidebar(){
        var existingAttributesDiv = document.getElementById('attributesDiv');
        if (existingAttributesDiv) {
            existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
        }
        var attributesDiv = document.createElement('div');
        attributesDiv.id = 'attributesDiv';
        attributesDiv.classList.add('attributes');
        var doorForm = document.createElement('form')
        doorForm.id = "doorForm";

        var doorIDInput = document.createElement('input')
        doorIDInput.id = 'doorID'
        doorIDInput.type = 'text'
        doorIDInput.name = 'doorID'
        doorIDInput.value = (this.id);
        var doorIDLabel = document.createElement('label')
        doorIDLabel.for = 'doorID'
        doorIDLabel.textContent = 'ID:'
        doorForm.appendChild(doorIDLabel)
        doorForm.appendChild(doorIDInput)

        let points = this.points()
        const pointLabel = document.createElement('label')
        pointLabel.for = 'pointInput1'
        pointLabel.textContent = 'Point('+1+'):'
        pointLabel.id = 'pointLabel'+1
        const pointXInput = document.createElement('input');
        pointXInput.id = "pointInput"+1
        pointXInput.type='number'
        pointXInput.size = 5;
        pointXInput.value = points[0]
        doorForm.appendChild(pointLabel)
        doorForm.appendChild(pointXInput)
        const pointYInput = document.createElement('input');
        pointYInput.id = "pointInput"+2
        pointYInput.type='number'
        pointYInput.size = 5;
        pointYInput.value = points[1]
        doorForm.appendChild(pointYInput)

        const pointLabel2 = document.createElement('label')
        pointLabel2.for = 'pointInput3'
        pointLabel2.textContent = 'Point('+2+'):'
        pointLabel2.id = 'pointLabel'+2
        const pointXInput2 = document.createElement('input');
        pointXInput2.id = "pointInput"+3
        pointXInput2.type='number'
        pointXInput2.size = 5;
        pointXInput2.value = points[2]
        doorForm.appendChild(pointLabel2)
        doorForm.appendChild(pointXInput2)
        const pointYInput2 = document.createElement('input');
        pointYInput2.id = "pointInput"+4
        pointYInput2.type='number'
        pointYInput2.size = 5;
        pointYInput2.value = points[3]
        doorForm.appendChild(pointYInput2)

        var formButton = document.createElement('button')
        formButton.type='submit'
        formButton.id='updateDoorDetailsBtn'
        formButton.style.display = 'block'
        formButton.textContent='Update'
        attributesDiv.appendChild(doorForm)
        doorForm.appendChild(formButton)
        document.getElementById('sidebar').appendChild(attributesDiv)
        doorForm.addEventListener('submit', function (event) {
            console.log("UpdateDoor")
            const newID = document.getElementById('doorID').value;
            selectedRoom.id = newID;
            var pointInputs = document.querySelectorAll('[id^="pointInput"]')
            let points = []
            pointInputs.forEach(inp=>{
                points.push(Math.floor(inp.value))

            })
            console.log(points)
            selectedRoom.points(points)
            selectedRoom.updateSidebar()

        })
    }

    handleRoomClick(){
        selectedRoom = this;
        tr.nodes([this]);
        this.updateSidebar()
    }
    updateScale(){
        let points = this.points()
        for (let i = 0; i < points.length; i++) {
            if (i%2===0){
                points[i]= Math.floor(this.startingPoints[i] * this.scaleX())
            }
            else{
                points[i]= Math.floor(this.startingPoints[i] * this.scaleY())
            }
        }

        this.scaleX(1)
        this.scaleY(1)
        this.points(points)
        this.startingPoints = points

    }

    updatePosition(){
        let points = this.points()
        // console.log(points)
        // console.log(this.x())
        // console.log(this.y())
        this.moveToTop()
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
        this.startingPoints = points
        console.log("points: "+points)
        console.log("starting poiuits:" + this.startingPoints)
    }
    delete(){
        tr.nodes([]);
    }

    ressurect(){
        layer.add(this);
    }

    moveBack(prevPoints){
        this.points(prevPoints)
        this.startingPoints = prevPoints
        this.updateSidebar()
    }

    handleRoomClick(){
        selectedRoom = this;
        tr.nodes([this]);
        this.updateSidebar()
    }
}


export function addDoor(points = [], id ="d-0-0") {
    if (points===[]) points = [50,50,80,50];
    var door = new Door(points, id)
    layer.add(door)
    door.moveToTop()

}