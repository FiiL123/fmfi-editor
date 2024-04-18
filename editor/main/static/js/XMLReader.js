import {addRoom} from "./RectangularRoom.js";

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

        console.log('x1:', x1);
        console.log('x2:', x2);
        console.log('y1:', y1);
        console.log('y2:', y2);
        addRoom(x1,y1,x2-x1,y2-y1,elem.getAttribute('id'),elem.getAttribute('number'))

        }
    }

    }
}


let xmlReader = new XMLReader(part_xml)