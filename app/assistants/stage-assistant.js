// Copyright 2010 Martin Thompson (martin@parallelpoints.com).
// 
// Redistribution and use in source and binary forms, with or 
// without modification, are permitted.

function StageAssistant() {
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