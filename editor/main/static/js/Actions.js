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
