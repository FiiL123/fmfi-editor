import {addRoom as addRectangularRoom} from "./RectangularRoom.js";
import {addPolygonRoom} from "./PolygonRoom.js";

export default class XMLReader{
    constructor(xml_text) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(part_xml,"text/xml");
    // console.log(part_xml)

    const part_elem = xmlDoc.getElementsByTagName("part")[0]
    let part_children = part_elem.children
    for (let elem of part_children){
        if (elem.tagName==="room" && elem.children[0].tagName==="rectangle"){
            const rectangle = elem.children[0];
            const x1 = parseInt(rectangle.getAttribute('x1'));
            const x2 = parseInt(rectangle.getAttribute('x2'));
            const y1 = parseInt(rectangle.getAttribute('y1'));
            const y2 = parseInt(rectangle.getAttribute('y2'));

            addRectangularRoom(x1,y1,x2-x1,y2-y1,elem.getAttribute('id'),elem.getAttribute('number'))

        }
        else if (elem.tagName==="room" && elem.children[0].tagName==="polygon") {
            const polygon = elem.children[0];
            let points = []
            for (let point of polygon.children) {
                const x = parseInt(point.getAttribute('x'));
                const y = parseInt(point.getAttribute('y'));
                points.push(x)
                points.push(y)
            }
            addPolygonRoom(points, elem.getAttribute('id'), elem.getAttribute('number'))
        }

        }

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