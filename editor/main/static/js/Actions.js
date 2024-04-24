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
        selectedRoom = null;
    }

    revert(){
        this.obj.ressurect();
    }
}

export class TransformAction{
    constructor(obj,prevX, prevY, prevW, prevH) {
        this.obj = obj;
        this.prevPostition = {x: prevX,y: prevY,w: prevW,h: prevH}
    }

    make(){

    }

    revert(){
        this.obj.moveBack(this.prevPostition);
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