
export class DeleteAction{
    constructor(obj) {
        this.obj = obj;
    }

    make(){
        this.obj.delete();
        this.obj.destroy();
    }

    revert(){
        // TODO
        return 0
    }
}