// Copyright 2010 Martin Thompson (martin@parallelpoints.com).
// 
// Redistribution and use in source and binary forms, with or 
// without modification, are permitted.

function LampAssistant() {
}

// Thanks to jkd (http://www.codingforums.com/member.php?u=3) for the next two functions
// Found here: http://www.codingforums.com/showthread.php?t=11156
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
// A transition is an array of:
//  (starting HSLs
//  ending HSLs
//  number of frames to get from one end to the other)
// which are then translated into a collection of deltas
// when the frame count is exceeded, move onto the next (start, end, count) collection.
// If none, cycle round 

function get_stepsize(start, end, numsteps)
{
    stepsize = (end-start)/numsteps;
    return stepsize;
}

var configured_transitions = Array(
 // Slowly All around the wheel
    Array (
{
    "start_hsl":Array(0.0,1.0,0.5),
    "end_hsl"  :Array(1.0,1.0,0.5),
    "numsteps":1000
}
	),
 // Black -> Green -> Black
    Array (
{
    "start_hsl":Array(0.33,1.0,0.0),
    "end_hsl"  :Array(0.33,1.0,0.5),
    "numsteps":300
},
{
    "start_hsl":Array(0.33,1.0,0.5),
    "end_hsl"  :Array(0.33,1.0,0.0),
    "numsteps":300
}
	),
 // Black -> Red -> Black
    Array (
{
    "start_hsl":Array(0.00,1.0,0.0),
    "end_hsl"  :Array(0.00,1.0,0.5),
    "numsteps":300
},
{
    "start_hsl":Array(0.00,1.0,0.5),
    "end_hsl"  :Array(0.00,1.0,0.0),
    "numsteps":300
}
	),
 // Black -> Blue -> Black
    Array (
{
    "start_hsl":Array(0.66,1.0,0.0),
    "end_hsl"  :Array(0.66,1.0,0.5),
    "numsteps":300
},
{
    "start_hsl":Array(0.66,1.0,0.5),
    "end_hsl"  :Array(0.66,1.0,0.0),
    "numsteps":300
}
	),
    Array ( // Faster all around the wheel
{
    "start_hsl":Array(0.0,1.0,0.5),
    "end_hsl"  :Array(1.0,1.0,0.5),
    "numsteps":250
}
	)
    )
LampAssistant.prototype.startTransition = function(transition) {
    this.transition = transition
    this.current_colour_hsl = this.transition["start_hsl"].slice(0); // make a copy
    this.delta_hsl = Array(0,0,0);
    for (var i = 0; i < this.delta_hsl.length;i++)
    {
	this.delta_hsl[i] = get_stepsize(this.transition["start_hsl"][i],
					 this.transition["end_hsl"][i],
					 this.transition["numsteps"]);
    }
    // Mojo.Log.info("Current transition start:"+this.transition["start_hsl"]);
    // Mojo.Log.info("Current transition end:"+this.transition["end_hsl"]);
    // Mojo.Log.info("Steps:"+this.delta_hsl);
    this.stepcount = 0;
}

LampAssistant.prototype.onTick = function() {
    rgb = hsl2rgb(this.current_colour_hsl);
    colour = rgb[0];
    colour = colour*256;
    colour += rgb[1];
    colour=colour*256;
    colour += rgb[2];
    colstring=colour.toString(16,6);
    colstring="000000".substr(0,6-colstring.length)+colstring;
    colstring="#"+colstring;
    bg.style.backgroundColor = colstring;
//    this.controller.get("lamp-bg").update(rgb[0]+ " "+ rgb[1]+ " "+rgb[2]+"<p>'"+colstring+"'");

    for (var i = 0; i < this.delta_hsl.length;i++)
    {
	this.current_colour_hsl[i] += this.delta_hsl[i];
    }
    this.stepcount ++;
    if (this.stepcount >= this.transition["numsteps"]) {
	this.transition_no ++;
	if (this.transition_no >= this.transition_set.length) {
	    this.transition_no = 0;
        }
        this.startTransition(this.transition_set[this.transition_no]);
    }
}

LampAssistant.prototype.onTap = function() {
    this.transition_no = 0;
    this.transition_set_id ++;
    if (this.transition_set_id >= configured_transitions.length) {
	this.transition_set_id = 0;
    }
    this.transition_set = configured_transitions[this.transition_set_id];
    this.startTransition(this.transition_set[this.transition_no]);
    // Mojo.Log.info("New transition id:"+this.transition_set_id);
}

LampAssistant.prototype.setup = function() {
    // Mojo.Log.info("Info");

    MenuAttr = {omitDefaultItems: true};
    MenuModel = {
    visible: true,
    items: [
	Mojo.Menu.editItem,
    {label: "Help...", command: 'do-help', shortcut: 'h'}
	]
    };
    this.controller.setupWidget(Mojo.Menu.appMenu, MenuAttr, MenuModel);


    bg = this.controller.document.getElementsByTagName("body")[0]
    Mojo.Event.listen(bg, Mojo.Event.tap, this.onTap.bind(this));

    this.activateHandler=this.activate.bind(this);
    Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.activateHandler);
 
    this.deactivateHandler=this.deactivate.bind(this);
    Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.deactivateHandler);
    
    this.transition_set = configured_transitions[0];
    this.transition_set_id = 0;
    this.startTransition(this.transition_set[0]);
    this.transition_no = 0;
};

LampAssistant.prototype.startAnimation = function() {
    // Mojo.Log.info("startAnimation ID="+this.intervalID);
    if (this.intervalID){
	Mojo.Log.info("Timer already running");
    }
    else {
    this.intervalID=this.controller.window.setInterval(this.onTick.bind(this), 40);
    // Mojo.Log.info("startAnimation ID="+this.intervalID);
    }
}

LampAssistant.prototype.stopAnimation = function() {
    // Mojo.Log.info("stopAnimation ID="+this.intervalID);
    clearInterval(this.intervalID);
    this.intervalID=null;
}

LampAssistant.prototype.activate = function(event) {
    // Mojo.Log.info("activate");
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
    this.startAnimation()
};

LampAssistant.prototype.deactivate = function(event) {
    // Mojo.Log.info("deactivate");
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
    this.stopAnimation()
};

LampAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

