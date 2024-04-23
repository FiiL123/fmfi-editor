import {TransformPolyAction} from "../Actions.js";

export default class PolygonRoom extends Konva.Line {
    constructor(points,attributes = new Map()) {
        const purpose = purposesData.find(function(purpose) {
                    return purpose.pk === attributes.get('purpose');
                });
        let color = getRandomColor()
        if (attributes.size>0){
            color = (purpose && purpose.fields.colour!== "") ? "rgb("+purpose.fields.colour+")" : "lightgray";
            if (attributes.get('id').startsWith('f-')) color = 'white'
        }
        super({
                points: points,
                fill: color,
                stroke: 'black',
                closed: true,
                draggable: true,
            },
        );
        this.attributes = attributes;
        this.startingPoints = points;
        this.id = (attributes.has('id')) ? attributes.get('id'): "";
        this.number = (attributes.has('number')) ? attributes.get('number'): "";
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
            this.updateTextPosition()
            actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
        })

        super.on('transform',function () {
            this.updateTextPosition();
        })

        super.on('transformstart', function () {
            this.prevPoints = [...this.points()]
            this.handleRoomClick()
        })
        super.on('transformend', function () {
            this.updateScale()
            this.updatePosition()
            this.updateSidebar()
            this.updateTextPosition();
            actionManager.addAction(new TransformPolyAction(this, this.prevPoints));

        })
        this.text = (attributes.has('custom-map-label')) ? attributes.get('custom-map-label') : this.number;
        this.text = this.text.replace("\\n", "\n");
        this.numberText = new Konva.Text({
        text: this.text,
        x: this.points()[0]+2,
        y: this.points()[1]+2,
        fontSize: (attributes.has('important')) ? 30 : 24,
      });
        // this.numberText.on('click',this.handleRoomClick)
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

    updateTextPosition(){
        let textX = this.points()[0]+2; // Adjust for bottom right corner
        let textY = this.points()[1]+2; // Adjust for bottom right corner
        this.numberText.position({ x: textX, y: textY });
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
        const addPointButton = document.createElement('button');
        addPointButton.textContent = 'Add point';
        addPointButton.id = 'addPointButton'
        addPointButton.addEventListener('click', function() {
            selectedRoom.addPoint()
        });
        polygonRoomForm.appendChild(addPointButton)
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
            var pointInputs = document.querySelectorAll('[id^="pointInput"]')
            let points = []
            pointInputs.forEach(inp=>{
                points.push(Math.floor(inp.value))

            })
            console.log(points)
            selectedRoom.id = newID;
            selectedRoom.number = newNumber;
            selectedRoom.points(points)
            selectedRoom.startingPoints = points
            console.log(selectedRoom.points())
            selectedRoom.updateSidebar()
        });
    }

    makePointForm(mainDiv){
        var pointsDiv = document.createElement('div');
        pointsDiv.id = 'pointsDiv';
        pointsDiv.classList.add('attributes');
        let points = this.points()
        for (let i = 0; i < points.length/2; ++i) {
            this.makePointInput(pointsDiv,i)

        }


        mainDiv.appendChild(pointsDiv);
    }
    addPoint(){
        this.points().push(0)
        this.points().push(0)
        this.startingPoints = this.points()
        this.prevPoints = [...this.points()]
        actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
        const pointsDiv = document.getElementById('pointsDiv')
        this.makePointInput(pointsDiv,this.points().length)
    }

    makePointInput(mainComponent, i){
        let points = this.points()
        i = i*2

        const pointLabel = document.createElement('label')
        pointLabel.for = 'pointInput'+i
        pointLabel.textContent = 'Point('+i/2+'):'
        pointLabel.id = 'pointLabel'+i
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.id = 'pointDelete'+i
        deleteButton.addEventListener('click', function() {
            console.log("deleting")
            document.getElementById('pointInput'+i).remove()
            document.getElementById('pointInput'+(i+1)).remove()
            document.getElementById('pointLabel'+i).remove()
            document.getElementById('pointDelete'+i).remove()
        });
        mainComponent.appendChild(deleteButton);
        const pointXInput = document.createElement('input');
        pointXInput.id = "pointInput"+i
        pointXInput.type='number'
        pointXInput.size = 5;
        pointXInput.value = points[i]
        mainComponent.appendChild(pointLabel)
        mainComponent.appendChild(pointXInput)
        const pointYInput = document.createElement('input');
        pointYInput.id = "pointInput"+(i+1)
        pointYInput.type='number'
        pointYInput.size = 5;
        pointYInput.value = points[i+1]
        mainComponent.appendChild(pointYInput)
    }

    delete(){
        this.numberText.remove()
        tr.nodes([]);
    }

    ressurect(){
        layer.add(this);
        layer.add(this.numberText);
    }

    moveBack(prevPoints){
        this.points(prevPoints)
        this.startingPoints = prevPoints
        this.updateSidebar()
        this.updateTextPosition()
    }

    handleRoomClick(){
        selectedRoom = this;
        tr.nodes([this]);
        this.updateSidebar()
    }

    lockDragging(){
        this.draggable(false)
    }
}




export function addPolygonRoom(points = [], attributes=new Map()){
    if (points===[]) points = [200,200,100,200,100,100,200,100];
    const room = new PolygonRoom(points, attributes);
    layer.add(room);
    layer.add(room.numberText)
    return room;
}