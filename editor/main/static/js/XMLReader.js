import {addRoom as addRectangularRoom} from "./objects/RectangularRoom.js";
import {addPolygonRoom} from "./objects/PolygonRoom.js";
import {addDoor} from "./objects/Door.js";
import {addLift} from "./objects/Lift.js";
import {addStairs} from "./objects/Stairs.js";

export default class XMLReader{
    constructor(xml_text) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(part_xml,"text/xml");
    // console.log(part_xml)

    const part_elem = xmlDoc.getElementsByTagName("part")[0]
    let part_children = part_elem.children
    for (let elem of part_children){
        let attributes = new Map()
        for (let attribute of elem.attributes) {
            attributes.set(attribute.name, attribute.value)
        }
        switch (elem.tagName) {
            case "room":
                if (elem.children[0].tagName==="rectangle"){
                    const rectangle = elem.children[0];
                    const rectPoints = this.readRectanglePoints(rectangle);
                    addRectangularRoom(rectPoints.x1,rectPoints.y1,rectPoints.x2-rectPoints.x1,
                        rectPoints.y2-rectPoints.y1,attributes)
                }
                else if (elem.children[0].tagName==="polygon"){
                    const polygon = elem.children[0];
                    let points = this.readPolygonPoints(polygon);
                    addPolygonRoom(points, attributes)
                }
                break;
            case "door":
                const line= elem.children[0]
                addDoor(this.readLinePoints(line), elem.getAttribute('id'));
                break;
            case "floor":
                if (elem.children[0].tagName==="rectangle"){
                    const rectangle = elem.children[0];
                    const rectPoints = this.readRectanglePoints(rectangle);

                    const r = addRectangularRoom(rectPoints.x1,rectPoints.y1,rectPoints.x2-rectPoints.x1,
                        rectPoints.y2-rectPoints.y1,attributes)
                    r.lockDragging();
                    r.moveToBottom();

                }
                else if (elem.children[0].tagName==="polygon"){
                    const polygon = elem.children[0];
                    let points = this.readPolygonPoints(polygon);
                    const r = addPolygonRoom(points, attributes);
                    r.lockDragging();
                    r.moveToBottom();
                }
                break;

            case "lift":
                const rectangle = elem.children[0];
                const rectPoints = this.readRectanglePoints(rectangle);

                const r = addLift(rectPoints.x1,rectPoints.y1,rectPoints.x2-rectPoints.x1,
                    rectPoints.y2-rectPoints.y1,attributes)
                break;
            case "stairway":
            case "stairs":
                if (elem.children[0].tagName==="line"){
                    const line0 = elem.children[0];
                    const line1 = elem.children[1];
                    const points = [...this.readLinePoints(line0),
                        ...this.reversePoints(this.readLinePoints(line1))]
                    console.log(points)
                    const s = addStairs(points,attributes);
                }else if (elem.children[0].tagName==="polyline"){
                    const line0 = elem.children[0];
                    const line1 = elem.children[1];
                    const points = [...this.readPolygonPoints(line0),
                        ...this.reversePoints(this.readPolygonPoints(line1))]
                    console.log(points)
                    const s = addStairs(points,attributes);
                }
                break;
            case "vending-machine":
                const rect = elem.children[0];
                const rp = this.readRectanglePoints(rect);
                addRectangularRoom(rp.x1,rp.y1,rp.x2-rp.x1,
                    rp.y2-rp.y1,attributes)

        }


        }

    }

    readPolygonPoints(polygon){
        let points = []
        for (let point of polygon.children) {
            const x = parseInt(point.getAttribute('x'));
            const y = parseInt(point.getAttribute('y'));
            points.push(x)
            points.push(y)
        }
        return points;
    }

    readRectanglePoints(rectangle){
        const x1 = parseInt(rectangle.getAttribute('x1'));
        const x2 = parseInt(rectangle.getAttribute('x2'));
        const y1 = parseInt(rectangle.getAttribute('y1'));
        const y2 = parseInt(rectangle.getAttribute('y2'));
        return {'x1':x1,'x2':x2,'y1':y1,'y2':y2}
    }

    readLinePoints(line){
        let points = []
        const x1 = parseInt(line.getAttribute('x1'));
        const x2 = parseInt(line.getAttribute('x2'));
        const y1 = parseInt(line.getAttribute('y1'));
        const y2 = parseInt(line.getAttribute('y2'));
        return [x1,y1,x2,y2];
    }

    reversePoints(points) {
    if (points.length % 2 !== 0) {
        throw new Error('Invalid number of coordinates. Coordinates should be even.');
    }

    let reversedPoints = [];
    for (let i = 0; i < points.length; i += 2) {
        // Insert each pair at the beginning of the new array
        reversedPoints.unshift(points[i], points[i+1]);
    }
    return reversedPoints;
}
}

/*
<room custom-search-string="aquarium" id="r-0-m-M-II" important="true" custom-map-label="M II" number="M II" name="Aquarium" purpose="classroom" capacity="39" vertex="v-0-m-ii">
            <polygon>
                <point x="-693" y="4155"/>
                <point x="17" y="4155"/>
                <point x="17" y="4500"/>
                <point x="-693" y="4500"/>
            </polygon>
        </room>

<door id="d-0-m-304">
    <line x1="17" x2="17" y1="4210" y2="4270"/>
</door>
 */

let xmlReader = new XMLReader(part_xml)