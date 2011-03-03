function StageAssistant() {
    /* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
    this.controller.pushScene("lamp");
};

// handleCommand - Setup handlers for menus:
//
StageAssistant.prototype.handleCommand = function(event) {
// var currentScene = this.controller.activeScene();
    if(event.type == Mojo.Event.command) {
	switch(event.command) {
	case 'do-help':
	this.controller.pushAppSupportInfoScene();
	break; 
	}
    }
};