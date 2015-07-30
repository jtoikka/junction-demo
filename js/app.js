var el = $('#webgl-view');

var renderer = new PIXI.WebGLRenderer(el.width(), el.height());

var stage = new PIXI.Container();

var worldTex = PIXI.Texture.fromImage('images/map.png');
var world = new PIXI.Sprite(worldTex);

var pulses = new Array();

var lastFrame = Date.now();

stage.addChild(world);

initialize();
onWindowResize();
animate();

function initialize() {
	$(window).on('resize', onWindowResize);
	el.append(renderer.view);

	pulses.push(new Pulse());
}

function animate() {
	var now = Date.now();
	var delta = now - lastFrame;
	lastFrame = now;
	pulses.forEach(function(pulse) {
		pulse.time += delta;
	});
	renderer.render(stage);
	requestAnimationFrame(animate);
}

function onWindowResize() {
	world.width = el.width();
	world.height = el.width()/2;
	renderer.resize(el.width(), el.height());
	renderer.render(stage);
}

function Pulse() {
	this.time = 0.0;
}
