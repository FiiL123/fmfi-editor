export default class ActionManager {
	constructor() {
		this.undoStack = [];
		this.redoStack = [];
	}

	addAction(action) {
		this.undoStack.push(action);
		console.log(this.undoStack);
	}

	revertLastAction() {
		console.log("reverting last action");
		const action = this.undoStack.pop();
		if (action) {
			action.revert();
			this.redoStack.push(action);
		}
	}

	redoLastAction() {
		console.log(this.redoStack);
		const action = this.redoStack.pop();
		if (action) {
			action.make();
		}
	}
}

var actionManager = new ActionManager();
window.actionManager = actionManager;
