var el = $('#webgl-view');

var renderer = new PIXI.autoDetectRenderer(el.width(), el.height(), {antialias: true});

var graphics = new PIXI.Graphics();

graphics.lineStyle(0);
graphics.beginFill(0xffffff, 0.7);

var worldWidth = 128;
var worldHeight = 64;

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

var lastFrame = Date.now();

initialize();
onWindowResize();
animate();

function initialize() {
	$(window).on('resize', onWindowResize);
	el.append(renderer.view);

	// pulses.push(new Pulse());
}

function animate() {
	var now = Date.now();
	var delta = now - lastFrame;
	lastFrame = now;
	// pulses.forEach(function(pulse) {
	// 	pulse.time += delta;
	// });
	renderer.render(stage);
	requestAnimationFrame(animate);
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
