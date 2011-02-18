function LampAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}
var    bg;
LampAssistant.prototype.onClick = function(event) {
	bg.style.backgroundColor = "#600000";
	this.controller.get("lamp-bg").update("#####");
	this.controller.document.getElementsByTagName("body")[0].style.backgroundColor = "#000060";

}


LampAssistant.prototype.setup = function() {
    bg = this.controller.get("lamp-bg");
  // bind the button to its handler
    Mojo.Event.listen(bg, Mojo.Event.tap, 
        this.onClick.bind(this));	/* this function is for setup tasks that have to happen when the scene is first created */
};

LampAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

LampAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

LampAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};