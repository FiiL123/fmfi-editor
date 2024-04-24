export default class ActionManager {
	constructor() {
		this.stack = [];
	}

	addAction(action) {
		this.stack.push(action);
		console.log(this.stack);
	}

	revertLastAction() {
		console.log("reverting last action");
		const action = this.stack.pop();
		if (action) {
			action.revert();
		}
	}
}

var actionManager = new ActionManager();
window.actionManager = actionManager;
