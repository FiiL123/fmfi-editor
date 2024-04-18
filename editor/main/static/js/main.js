
var width = 10 * (window.innerWidth / 12) - 10;
console.log(width)
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'canvas-container',
    width: width,
    height: height,
    draggable: true
});

var scaleBy = 1.1;
stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({x: newScale, y: newScale});

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
});

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

stage.on('touchmove', function (e) {
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

stage.on('touchend', function (e) {
    lastDist = 0;
    lastCenter = null;
});

var bottom_layer = new Konva.Layer();
stage.add(bottom_layer)

console.log(img_src)
var imageObj = new Image();
imageObj.onload = function () {
    var map = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: img_wid,
      height: img_hei,
    });
    // add the shape to the layer
    bottom_layer.add(map);
};
imageObj.onerror = function() {
    console.error("Error loading image:", img_src);
};
imageObj.src = img_src;

var layer = new Konva.Layer();
layer.opacity(0.7)
stage.add(layer);

// create new transformer

var tr = new Konva.Transformer({rotateEnabled: false});

layer.add(tr);

var selectedRoom = null;

// stage.on('mousemove', function (e) {
//     const mousePos = stage.getPointerPosition();
//     console.log("Cursor position - x: " + mousePos.x + ", y: " + mousePos.y);
// });

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getRandomColor(from=150, to = 230){
    let colorStr = "rgb(" + getRandomInt(from, to) + "," + getRandomInt(from, to) + "," + getRandomInt(from, to) + ")"
    console.log(colorStr)
    return colorStr
}

/*TODO
Presuvanie viacerych objektov naraz
Snapovanie++
Snapovanie dveri
Levely su relativne k matike
 */

// console.log(part_xml)

parser = new DOMParser();
xmlDoc = parser.parseFromString(part_xml,"text/xml");
console.log(part_xml)
xmlDoc.childNodes.forEach((elem)=>{
    console.log(elem)
})