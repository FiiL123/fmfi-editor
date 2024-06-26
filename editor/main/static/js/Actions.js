class EmptyAction {
	constructor() {}

	make() {}

	revert() {}
}

export class DeleteAction extends EmptyAction {
	constructor(obj) {
		super();
		this.obj = obj;
	}

	make() {
		this.obj.delete();
		const index = objects.indexOf(this.obj);
		if (index !== -1) {
			objects.splice(index, 1);
		}
		selectedRoom = null;
		console.log(objects);
	}

	revert() {
		this.obj.ressurect();
		objects.push(this.obj);
		console.log(objects);
	}
}

export class TransformAction extends EmptyAction {
	constructor(obj, prevX, prevY, prevW, prevH) {
		super();
		this.obj = obj;
		this.prevPostition = { x: prevX, y: prevY, w: prevW, h: prevH };
		this.currentPosition = {
			x: this.obj.x(),
			y: this.obj.y(),
			w: this.obj.width(),
			h: this.obj.height(),
		};
	}

	make() {
		this.obj.moveBack(this.currentPosition);
	}

	revert() {
		this.obj.moveBack(this.prevPostition);
	}
}

export class TransformText extends EmptyAction {
	constructor(obj, prevPoints) {
		super();
		this.obj = obj;
		this.prevPostition = prevPoints;
		this.currentPosition = {
			x: this.obj.x(),
			y: this.obj.y(),
		};
	}

	make() {
		this.obj.moveBack(this.currentPosition);
	}

	revert() {
		this.obj.moveBack(this.prevPostition);
	}
}

export class TransformPolyAction extends EmptyAction {
	constructor(obj, points) {
		super();
		this.obj = obj;
		this.prevPoints = points;
		this.currentPoints = this.obj.points();
	}

	make() {
		this.obj.moveBack(this.currentPoints);
	}

	revert() {
		this.obj.moveBack(this.prevPoints);
	}
}

export class SwitchGeometryAction {
	constructor(obj, prevGeometry) {
		this.obj = obj;
		this.prevGeometry = prevGeometry;
		this.currGeometry = this.obj.geometry;
	}

	make() {
		this.obj.geometrySwap(this.currGeometry);
	}

	revert() {
		this.obj.geometrySwap(this.prevGeometry);
	}
}
