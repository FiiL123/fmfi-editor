stage.on("touchmove", (e) => {
	e.evt.preventDefault();
	var touch1 = e.evt.touches[0];
	var touch2 = e.evt.touches[1];

	// we need to restore dragging, if it was cancelled by multi-touch
	if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
		stage.startDrag();
		dragStopped = false;
	}

	if (touch1 && touch2) {
		// if the stage was under Konva's drag&drop
		// we need to stop it, and implement our own pan logic with two pointers
		if (stage.isDragging()) {
			dragStopped = true;
			stage.stopDrag();
		}

		var p1 = {
			x: touch1.clientX,
			y: touch1.clientY,
		};
		var p2 = {
			x: touch2.clientX,
			y: touch2.clientY,
		};

		if (!lastCenter) {
			lastCenter = getCenter(p1, p2);
			return;
		}
		var newCenter = getCenter(p1, p2);

		var dist = getDistance(p1, p2);

		if (!lastDist) {
			lastDist = dist;
		}

		// local coordinates of center point
		var pointTo = {
			x: (newCenter.x - stage.x()) / stage.scaleX(),
			y: (newCenter.y - stage.y()) / stage.scaleX(),
		};

		var scale = stage.scaleX() * (dist / lastDist);

		stage.scaleX(scale);
		stage.scaleY(scale);

		// calculate new position of the stage
		var dx = newCenter.x - lastCenter.x;
		var dy = newCenter.y - lastCenter.y;

		var newPos = {
			x: newCenter.x - pointTo.x * scale + dx,
			y: newCenter.y - pointTo.y * scale + dy,
		};

		stage.position(newPos);

		lastDist = dist;
		lastCenter = newCenter;
	}
});

stage.on("touchend", (e) => {
	lastDist = 0;
	lastCenter = null;
});

stage.on("wheel", (e) => {
	// stop default scrolling
	e.evt.preventDefault();

	var oldScale = stage.scaleX();
	var pointer = stage.getPointerPosition();

	var mousePointTo = {
		x: (pointer.x - stage.x()) / oldScale,
		y: (pointer.y - stage.y()) / oldScale,
	};

	// how to scale? Zoom in? Or zoom out?
	let direction = e.evt.deltaY > 0 ? -1 : 1;

	// when we zoom on trackpad, e.evt.ctrlKey is true
	// in that case lets revert direction
	if (e.evt.ctrlKey) {
		direction = -direction;
	}

	var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

	stage.scale({ x: newScale, y: newScale });

	var newPos = {
		x: pointer.x - mousePointTo.x * newScale,
		y: pointer.y - mousePointTo.y * newScale,
	};
	stage.position(newPos);
});

stage.on("click", function (e) {
	if (e.target === stage) {
		const existingAttributesDiv = document.getElementById("attributesDiv");
		if (existingAttributesDiv) {
			existingAttributesDiv.parentNode.removeChild(existingAttributesDiv);
		}
		selectedRoom = null;
		tr.nodes([]);
	}
});
