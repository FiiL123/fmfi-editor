import Door, { addDoor } from "./objects/Door.js";
import { addLift } from "./objects/Lift.js";
import Room, { addRoom } from "./objects/Room.js";
import Stairs, { addStairs } from "./objects/Stairs.js";
import Floor, { addFloor } from "./objects/Floor.js";

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
					const rectangle = elem.children[0];
					const rectPoints = this.readRectanglePoints(rectangle);
					const geometry = {
						x: rectPoints.x1,
						y: rectPoints.y1,
						w: rectPoints.x2 - rectPoints.x1,
						h: rectPoints.y2 - rectPoints.y1,
					};
					const r = addLift(attributes, "rectangle", geometry);
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
						const s = addStairs(points, attributes);
					} else if (elem.children[0].tagName === "polyline") {
						const line0 = elem.children[0];
						const line1 = elem.children[1];
						const points = [
							...this.readPolygonPoints(line0),
							...this.reversePoints(this.readPolygonPoints(line1)),
						];
						const s = addStairs(points, attributes);
					}
					break;
				// case "vending-machine":
				// 	const rect = elem.children[0];
				// 	const rp = this.readRectanglePoints(rect);
				// 	addRectRoom(rp.x1, rp.y1, rp.x2 - rp.x1, rp.y2 - rp.y1, attributes);
			}
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
				console.log("calling to XML for " + obj);
				obj.toXML(doc, partElem);
			}
		}

		doc.appendChild(partElem); // Make sure to append your created element to the document

		// Serialize the XML document to a string
		const serializer = new XMLSerializer();
		const xmlString = serializer.serializeToString(doc);

		// Create a Blob from the XML string
		const blob = new Blob([xmlString], { type: "application/xml" });

		// Create a download link and trigger the download
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = "exported_file.xml"; // Name the file
		document.body.appendChild(downloadLink); // Append link to the body
		downloadLink.click(); // Programmatically click the link to trigger the download

		// Clean up
		document.body.removeChild(downloadLink);
		URL.revokeObjectURL(url); // Free up the memory used by the Blob
	}
}

const xmlReader = new XMLReader(part_xml);
xmlReader.exportXML();
