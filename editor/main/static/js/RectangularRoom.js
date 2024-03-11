// import { Konva } from './konva.min.js';
export default class RectangularRoom extends Konva.Rect {
    constructor(x, y, tr) {
        console.log(x+" "+y)
        super({
                x: x,
                y: y,
                width: 100,
                height: 90,
                fill: 'red',
                name: 'rect',
                stroke: 'black',
                draggable: true,
            },
        );
        super.on('transformstart', function () {
            console.log('transform start');
        });

        super.on('dragmove', function () {
            // updateText();
        });
        super.on('transform', function () {
            // updateText();
            console.log('transform');
        });

        super.on('transformend', function () {
            console.log('transform end');
        });

        super.on('click', function () {
            console.log("klikikik")
            tr.nodes([this]);
        })
    }

}

export function addRoom(){
    var room = new RectangularRoom(100, 200,tr)
    layer.add(room)
}