class EmptyAction{
    constructor(props) {

    }

    make(){

    }

    revert(){

    }

}


export class DeleteAction{
    constructor(obj) {
        this.obj = obj;
    }

    make(){
        this.obj.delete();
        this.obj.remove();
        selectedRoom = null;
    }

    revert(){
        this.obj.ressurect();
    }
}

export class TransformAction{
    constructor(obj,prevX, prevY, prevW, prevH) {
        this.obj = obj;
        this.prevX= prevX;
        this.prevY= prevY;
        this.prevW= prevW;
        this.prevH= prevH;
    }

    make(){

    }

    revert(){
        this.obj.moveBack(this.prevX,this.prevY,this.prevW,this.prevH);
    }

}

export class TransformPolyAction{
    constructor(obj, points) {
        this.obj = obj;
        this.prevPoints= points;
    }

    make(){

    }

    revert(){
        this.obj.moveBack(this.prevPoints)
    }

}