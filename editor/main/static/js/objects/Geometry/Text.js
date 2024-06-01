import { TransformText } from "../../Actions.js";

export default class Text extends Konva.Text {
	constructor(room, points, text, color, scale) {
		super({
			x: points.x,
			y: points.y,
			text: text,
			fontSize: 60 / scale,
			fill: color,
			draggable: true,
		});
		this.room = room;
		this.startingPoints = points;
		super.on("click", this.handleRoomClick);
		super.on("dragstart", function () {
			this.prevPoints = { x: this.x(), y: this.y() };
			this.handleRoomClick();
		});
		super.on("dragend", function () {
			this.position({ x: Math.floor(this.x()), y: Math.floor(this.y()) });
			this.room.updateSidebar();
			actionManager.addAction(new TransformText(this, this.prevPoints));
		});
	}

	handleRoomClick() {
		selectedRoom = this.room;
		this.room.updateSidebar();
	}

	createFormItems(elemtent) {}

	getFormData() {}

	moveBack(prevPoints) {
		this.x(prevPoints.x);
		this.y(prevPoints.y);
		this.startingPoints = prevPoints;
		this.room.updateSidebar();
	}
}
