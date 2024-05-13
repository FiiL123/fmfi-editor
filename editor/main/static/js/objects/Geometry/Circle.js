export default class Circle extends Konva.Circle {
	constructor(vertex, x, y, color) {
		super({
			x: x,
			y: y,
			radius: 5,
			fill: color,
			stroke: "black",
			strokeWidth: 1,
			draggable: true,
		});
		this.vertex = vertex;
		super.on("click", this.handleRoomClick);
		super.on("dragstart", function () {
			this.handleRoomClick();
		});
		super.on("dragend", function () {
			this.handlePositionChange();
			this.vertex.updateSidebar();
			// actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
		super.on("drag", function () {
			this.handlePositionChange();
			this.vertex.updateSidebar();
			// actionManager.addAction(new TransformPolyAction(this, this.prevPoints));
		});
	}
	handleRoomClick() {
		selectedRoom = this.vertex;
		this.vertex.updateSidebar();
	}

	handlePositionChange() {
		this.x(Math.floor(this.x()));
		this.y(Math.floor(this.y()));
		this.vertex.attributes.set("x", this.x());
		this.vertex.attributes.set("y", this.y());
		this.vertex.updatePosition();
	}

	createFormItems(elemtent) {}
}
