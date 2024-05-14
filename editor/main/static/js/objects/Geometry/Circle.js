import { TransformAction } from "../../Actions.js";

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
			this.prevX = this.x();
			this.prevY = this.y();
		});
		super.on("dragend", function () {
			this.handlePositionChange();
			this.vertex.updateSidebar();
			actionManager.addAction(
				new TransformAction(this, this.prevX, this.prevY, 0, 0),
			);
		});
		super.on("drag", function () {
			this.handlePositionChange();
			this.vertex.updateSidebar();
		});
	}
	handleRoomClick() {
		selectedRoom = this.vertex;
		this.vertex.updateSidebar();
	}

	moveBack(prev) {
		this.x(prev.x);
		this.y(prev.y);
		this.vertex.updateSidebar();
		this.vertex.updatePosition();
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
