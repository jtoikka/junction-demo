var el = $('#webgl-view');



var pixelRatio = window.devicePixelRatio || 1;

var rendererOptions = {
    antialias:true,
    transparent:false,
    resolution:pixelRatio
}

var renderer = new PIXI.autoDetectRenderer(el.width(), el.height(), rendererOptions);

var graphics = new PIXI.Graphics();

//graphics.lineStyle(1,0xffffff, 0.7);
graphics.lineStyle(0);
graphics.beginFill(0xffffff, 0.7);

var worldWidth = 128;
var worldHeight = 49;

var cellWidth = 32;
var halfWidth = cellWidth / 2;
var margin = 2;

for (var x = 0; x < worldWidth; x++) {
	for (var y = 0; y < worldHeight; y++) {
		if (world[x + y * worldWidth] === 1) {
			graphics.drawCircle(halfWidth + x * cellWidth, halfWidth + y * cellWidth, halfWidth - margin);
		}
	}
}
graphics.endFill();


var stage = new PIXI.Container();

stage.addChild(graphics);

var pulses = new Array();

var fps = 8;
var lastFrame = 0;

initialize();
onWindowResize();
animate();

function initialize() {
	$(window).on('resize', onWindowResize);
	el.append(renderer.view);

	// pulses.push(new Pulse());
}

function animate() {
	var now = new Date().getTime();
	var delta = now - lastFrame;
	if(delta >= (1000 / fps)){
		console.log("Draw");
		lastFrame = now;
		renderer.render(stage);
	}
	requestAnimationFrame(animate);

	// pulses.forEach(function(pulse) {
	// 	pulse.time += delta;
	// });
	

}

function onWindowResize() {
	graphics.width = el.width();
	graphics.height = el.width() * (worldHeight / worldWidth);
	renderer.resize(el.width(), el.height());
	renderer.render(stage);
}

// function Pulse() {
// 	this.time = 0.0;
// }
