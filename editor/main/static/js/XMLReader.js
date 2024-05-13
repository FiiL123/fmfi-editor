import Door, { addDoor } from "./objects/Door.js";
import { addLift } from "./objects/Lift.js";
import Room, { addRoom } from "./objects/Room.js";
import Stairs, { addStairs } from "./objects/Stairs.js";
import Floor, { addFloor } from "./objects/Floor.js";
import { addVendingMachine } from "./objects/VendingMachine.js";
import { addWall } from "./objects/Wall.js";
import { addVertex } from "./objects/Vertex.js";
import { addEdge } from "./objects/Edge.js";

export default class XMLReader {
	constructor(xml_text) {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(part_xml, "text/xml");

		const part_elem = xmlDoc.getElementsByTagName("part")[0];
		const part_children = part_elem.children;
		for (const elem of part_children) {
			const attributes = new Map();
			for (const attribute of elem.attributes) {
				attributes.set(attribute.name, attribute.value);
			}
			switch (elem.tagName) {
				case "room":
					if (elem.children[0].tagName === "rectangle") {
						const rectangle = elem.children[0];
						const rectPoints = this.readRectanglePoints(rectangle);
						const geometry = {
							x: rectPoints.x1,
							y: rectPoints.y1,
							w: rectPoints.x2 - rectPoints.x1,
							h: rectPoints.y2 - rectPoints.y1,
						};
						const r = addRoom(attributes, "rectangle", geometry);
					} else if (elem.children[0].tagName === "polygon") {
						const polygon = elem.children[0];
						const points = this.readPolygonPoints(polygon);
						const r = addRoom(attributes, "polygon", points);
						// addPolygonRoom(points, attributes)
					}
					break;
				case "door":
					const line = elem.children[0];
					const points = this.readLinePoints(line);
					addDoor(attributes, "line", points);
					break;
				case "floor":
					if (elem.children[0].tagName === "rectangle") {
						const rectangle = elem.children[0];
						const rectPoints = this.readRectanglePoints(rectangle);
						const geometry = {
							x: rectPoints.x1,
							y: rectPoints.y1,
							w: rectPoints.x2 - rectPoints.x1,
							h: rectPoints.y2 - rectPoints.y1,
						};
						const f = addFloor(attributes, "rectangle", geometry);
						f.lockDragging();
						f.geometry.moveToBottom();
					} else if (elem.children[0].tagName === "polygon") {
						const polygon = elem.children[0];
						const points = this.readPolygonPoints(polygon);
						const f = addFloor(attributes, "polygon", points);
						f.lockDragging();
						f.geometry.moveToBottom();
					}
					break;

				case "lift":
					const rectangle1 = elem.children[0];
					const rectPoints1 = this.readRectanglePoints(rectangle1);
					const geometry1 = {
						x: rectPoints1.x1,
						y: rectPoints1.y1,
						w: rectPoints1.x2 - rectPoints1.x1,
						h: rectPoints1.y2 - rectPoints1.y1,
					};
					const r = addLift(attributes, "rectangle", geometry1);
					break;
				case "stairway":
				case "stairs":
					if (elem.children[0].tagName === "line") {
						const line0 = elem.children[0];
						const line1 = elem.children[1];
						const points = [
							...this.readLinePoints(line0),
							...this.reversePoints(this.readLinePoints(line1)),
						];
						const s = addStairs(attributes, "polygon", points);
					} else if (elem.children[0].tagName === "polyline") {
						const line0 = elem.children[0];
						const line1 = elem.children[1];
						const points = [
							...this.readPolygonPoints(line0),
							...this.reversePoints(this.readPolygonPoints(line1)),
						];
						const s = addStairs(attributes, "polygon", points);
					}
					break;
				case "vending-machine":
					const rectangle2 = elem.children[0];
					const rectPoints2 = this.readRectanglePoints(rectangle2);
					const geometry2 = {
						x: rectPoints2.x1,
						y: rectPoints2.y1,
						w: rectPoints2.x2 - rectPoints2.x1,
						h: rectPoints2.y2 - rectPoints2.y1,
					};
					const m = addVendingMachine(attributes, "rectangle", geometry2);
					break;
				case "wall":
					const geo = elem.children[0];
					let points1 = [];
					if (geo.tagName === "polyline") {
						points1 = this.readPolygonPoints(elem.children[0]);
						const l = addWall(attributes, "polyline", points1);
					} else {
						points1 = this.readLinePoints(geo);
						const l = addWall(attributes, "line", points1);
					}
					break;
				case "vertex":
					const vertex = addVertex(attributes);
					break;
				case "edge":
					const edge = addEdge(attributes);
					break;
			}
		}
		for (const lateEdge of lateEdges) {
			lateEdge.createEdge();
		}
	}

	readPolygonPoints(polygon) {
		const points = [];
		for (const point of polygon.children) {
			const x = parseInt(point.getAttribute("x"));
			const y = parseInt(point.getAttribute("y"));
			points.push(x);
			points.push(y);
		}
		return points;
	}

	readRectanglePoints(rectangle) {
		const x1 = parseInt(rectangle.getAttribute("x1"));
		const x2 = parseInt(rectangle.getAttribute("x2"));
		const y1 = parseInt(rectangle.getAttribute("y1"));
		const y2 = parseInt(rectangle.getAttribute("y2"));
		return { x1: x1, x2: x2, y1: y1, y2: y2 };
	}

	readLinePoints(line) {
		const points = [];
		const x1 = parseInt(line.getAttribute("x1"));
		const x2 = parseInt(line.getAttribute("x2"));
		const y1 = parseInt(line.getAttribute("y1"));
		const y2 = parseInt(line.getAttribute("y2"));
		return [x1, y1, x2, y2];
	}

	reversePoints(points) {
		if (points.length % 2 !== 0) {
			throw new Error(
				"Invalid number of coordinates. Coordinates should be even.",
			);
		}

		const reversedPoints = [];
		for (let i = 0; i < points.length; i += 2) {
			// Insert each pair at the beginning of the new array
			reversedPoints.unshift(points[i], points[i + 1]);
		}
		return reversedPoints;
	}

	exportXML() {
		const doc = document.implementation.createDocument("", "", null);
		const partElem = doc.createElement("part");
		console.log(objects);
		for (const obj of objects) {
			if (!(obj instanceof Stairs)) {
				// console.log("calling to XML for " + obj);
				obj.toXML(doc, partElem);
			}
		}

		doc.appendChild(partElem); // Make sure to append your created element to the document

		// Serialize the XML document to a string
		const serializer = new XMLSerializer();
		const xmlString = serializer.serializeToString(doc);

		fetch(`/part_xml/${part_id}/`, {
			method: "POST",
			headers: {
				"Content-Type": "text/xml",
			},
			body: xmlString,
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error("Error:", error));
	}
}

const xmlReader = new XMLReader(part_xml);

export function exportPartXML() {
	xmlReader.exportXML();
}
