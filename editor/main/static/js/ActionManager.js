export default class ActionManager {
	constructor() {
		this.undoStack = [];
		this.redoStack = [];
	}

	addAction(action) {
		this.undoStack.push(action);
		console.log(this.undoStack);
	}

	undoLastAction() {
		const action = this.undoStack.pop();
		if (action) {
			action.revert();
			this.redoStack.push(action);
		}
	}

	redoLastAction() {
		const action = this.redoStack.pop();
		if (action) {
			action.make();
			this.undoStack.push(action);
		}
	}
}

var actionManager = new ActionManager();
window.actionManager = actionManager;
