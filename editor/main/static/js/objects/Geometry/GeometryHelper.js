export function handlePolyPositionChange(obj) {
	const points = obj.points();

	for (let i = 0; i < points.length; i++) {
		if (i % 2 === 0) {
			points[i] = Math.floor(obj.startingPoints[i] + obj.x());
		} else {
			points[i] = Math.floor(obj.startingPoints[i] + obj.y());
		}
	}
	obj.x(0);
	obj.y(0);
	obj.points(points);
	obj.startingPoints = points;
}
export function handlePolySizeChange(obj) {
	const points = obj.points();
	for (let i = 0; i < points.length; i++) {
		if (i % 2 === 0) {
			points[i] = Math.floor(obj.startingPoints[i] * obj.scaleX());
		} else {
			points[i] = Math.floor(obj.startingPoints[i] * obj.scaleY());
		}
	}

	obj.scaleX(1);
	obj.scaleY(1);
	obj.points(points);
	obj.startingPoints = points;
}

export function createPointXMLElems(doc, parent, points) {
	for (let i = 0; i < points().length; i += 2) {
		const pointElem = doc.createElement("point");
		pointElem.setAttribute("x", points()[i]);
		pointElem.setAttribute("y", points()[i + 1]);
		parent.appendChild(pointElem);
	}
}
