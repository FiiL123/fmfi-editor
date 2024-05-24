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
		selectedRoom = null;
	}

	revert() {
		this.obj.ressurect();
	}
}

export class TransformAction extends EmptyAction {
	constructor(obj, prevX, prevY, prevW, prevH) {
		super();
		this.obj = obj;
		this.prevPostition = { x: prevX, y: prevY, w: prevW, h: prevH };
	}

	make() {}

	revert() {
		this.obj.moveBack(this.prevPostition);
	}
}

export class TransformPolyAction extends EmptyAction {
	constructor(obj, points) {
		super();
		this.obj = obj;
		this.prevPoints = points;
	}

	make() {}

	revert() {
		this.obj.moveBack(this.prevPoints);
	}
}
