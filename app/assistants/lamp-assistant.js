function LampAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

function hsl2rgb(hsl) {
	var m1, m2, hue;
	var r, g, b;
	var h,s,l;
	h=hsl[0];s=hsl[1];l=hsl[2];
	 
	if (s <= 0.001)
		r = g = b = (l * 255);
	else {
		if (l <= 0.5)
			m2 = l * (s + 1);
		else
			m2 = l + s - l * s;
		m1 = l * 2 - m2;
		hue = h ;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}
	return Array(Math.round(r),Math.round(g),Math.round(b));
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return 255 * v;
}

var    bg;
LampAssistant.prototype.onTick = function() {
    rgb = hsl2rgb(this.current_colour_hsl);
    //rgb=Array(255,255,0);
    colour = rgb[0];
    colour = colour*256;
    colour += rgb[1];
    colour=colour*256;
    colour += rgb[2];
    colstring=colour.toString(16,6);
    colstring="000000".substr(0,6-colstring.length)+colstring;
    colstring="#"+colstring;
    bg.style.backgroundColor = colstring;
    Mojo.Log.info("Colour:"+colstring);
    this.controller.get("lamp-bg").update(rgb[0]+ " "+ rgb[1]+ " "+rgb[2]+"<p>'"+colstring+"'");
    this.current_colour_hsl[0]=this.current_colour_hsl[0] + 0.001;
    if (this.current_colour_hsl[0] > 1.0){
	this.current_colour_hsl[0]-=1.0;
    }
}


LampAssistant.prototype.setup = function() {
    Mojo.Log.info("Info");
    this.current_colour_hsl=Array(0.0, 1.0, 0.5);
    bg = this.controller.document.getElementsByTagName("body")[0]
  // bind the button to its handler
    // Mojo.Event.listen(bg, Mojo.Event.tap, 
        // this.onClick.bind(this));	/* this function is for setup tasks that have to happen when the scene is first created */
    this.controller.window.setInterval(this.onTick.bind(this), 20);
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
