var width = 9 * (window.innerWidth / 12) - 10;
var height = window.innerHeight;

var stage = new Konva.Stage({
	container: "canvas-container",
	width: width,
	height: height,
	draggable: true,
});

var scaleBy = 1.1;

function getDistance(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
	return {
		x: (p1.x + p2.x) / 2,
		y: (p1.y + p2.y) / 2,
	};
}

var lastCenter = null;
var lastDist = 0;
var dragStopped = false;

stage.getContainer().style.backgroundColor = "#ffefe0";
var layer = new Konva.Layer();

if (img_src != null) {
	var bottom_layer = new Konva.Layer();
	stage.add(bottom_layer);

	var imageObj = new Image();
	imageObj.onload = () => {
		var map = new Konva.Image({
			x: -img_x_offset,
			y: -img_y_offset,
			image: imageObj,
			width: img_wid,
			height: img_hei,
		});
		bottom_layer.add(map);
	};
	imageObj.onerror = () => {
		console.error("Error loading image:", img_src);
	};
	imageObj.src = img_src;
	layer.opacity(0.7);
}

stage.add(layer);

var tr = new Konva.Transformer({ rotateEnabled: false });

layer.add(tr);

var graphLayer = new Konva.Layer();
stage.add(graphLayer);
graphLayer.visible(false);

var selectedRoom = null;

var objects = [];
