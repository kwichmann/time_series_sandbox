var rho_slider;
var sigma_slider;
var rho_value;
var sigma_value;

var ts;
var last_rho;


function setup() {
	var canvas_div = select("#canvas");
	var canvas = createCanvas(800, 500);
	canvas_div.child(canvas);

	background(255);

	var rho_div = select("#rho");
	rho_slider = createSlider(0, 1.1, 0.8, 0.01);
	rho_div.child(rho_slider);
	
	rho_value = createSpan("a");
	rho_div.child(rho_value);

	var sigma_div = select("#sigma");
	sigma_slider = createSlider(0, 50, 25, 1);
	sigma_div.child(sigma_slider);

	sigma_value = createSpan("b");
	sigma_div.child(sigma_value);

	generate_ts();
	
	rho_slider.changed(generate_ts);	
	sigma_slider.changed(generate_ts);

	var reset_button = createButton("Generate new series");
	reset_button.mouseClicked(generate_ts);
}	

function draw() {
	background(255);
	draw_ts(height / 2);

	rho_value.html("Value: " + rho_slider.value());
	sigma_value.html("Value: " + sigma_slider.value());
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function generate_ts() {
	ts = [];

	var y = 0;
	var rho = rho_slider.value();
	var sigma = sigma_slider.value();

	for (var t = 0; t < width / 2; t++) {
		ts.push(y);
		y = rho * y + sigma * randn_bm();
	}

	last_rho = rho;
}

function draw_ts(y_offset) {
	strokeWeight(3);
	stroke(0);
	line(0, y_offset, width, y_offset);

	if (last_rho < 1) {
		stroke(0, 0, 255);
	}
	if (last_rho > 1) {
		stroke(255, 0, 0);
	}
	if (last_rho === 1) {
		stroke(0, 255, 0);
	}

	strokeWeight(2);

	for (var t = 0; t < width - 1; t++) {
		line(t * 2, ts[t] + y_offset, (t + 1) * 2, ts[t + 1] + y_offset);
	}
}