var el = $('#webgl-view');



var pixelRatio = window.devicePixelRatio || 1;

var rendererOptions = {
    antialias:true,
    transparent:false,
    resolution:pixelRatio
}

var renderer = new PIXI.autoDetectRenderer(el.width(), el.height(), rendererOptions);

var sprites = [];

var worldWidth = 128;
var worldHeight = 49;

var cellWidth = 32;
var halfWidth = cellWidth / 2;
var margin = 2;

var scale = el.width()/ (cellWidth * worldWidth);

var worldColors = [];

var stage = new PIXI.Container(0xffffff);

for (var y = 0; y < worldHeight; y++) {
	for (var x = 0; x < worldWidth; x++) {
		if (world[x + y * worldWidth] === 1) {
			var sprite = PIXI.Sprite.fromImage("images/circle.png");
			sprite.position.x = x * cellWidth * scale;
			sprite.position.y = y * cellWidth * scale;

			sprite.scale.x = scale;
			sprite.scale.y = scale;

			stage.addChild(sprite);
			sprites.push(sprite);
		} else {
			sprites.push('');
		}
	}
}

var effects = new Array();

var fps = 23.97;
var helsinkiFps = 1.0;
var lastFrame = new Date().getTime();

initialize();
onWindowResize();
animate();

var colorBag = [
	new PointColor(251, 105, 0),
	new PointColor(12, 108, 112),
	new PointColor(220, 195, 25)
];

function initialize() {
	$(window).on('resize', onWindowResize);
	el.append(renderer.view);

	resetColours();
}

function pulse(x, y, color, speed) {
	return new Effect(x, y, color, 17000, function(x, y, t) {
		var dist = Math.sqrt(x * x + y * y);
		var st = t * speed;
		if (dist < st && dist > (st - 210.0)) {
			return (1 - (st - dist)/210.0);// * (60.0 - st)/60.0;
		}
		return 0;
	});
}

function PointColor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function resetColours() {
	for (var y = 0; y < worldHeight; y++) {
		for (var x = 0; x < worldWidth; x++) {
			worldColors[x + y * worldWidth] = new PointColor(10, 10, 10);
		}
	}
}

function rgbToHex(r, g, b) {
  return (r << 16) + (g << 8) + b;
}

function pointColorToHex(color) {
	return rgbToHex(color.r, color.g, color.b);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var helsinkiCounter = 0.0;

function animate() {
	var now = new Date().getTime();
	var delta = now - lastFrame;
	effects.forEach(function(effect) {
		effect.time += delta;
	});
	var i = effects.length;
	while (i--) {
		if (effects[i].time >= effects[i].life) {
			effects.splice(i, 1);
		}
	}
	if (delta >= (1000 / fps)) {
		resetColours();
		for (var y = 0; y < worldHeight; y++) {
			for (var x = 0; x < worldWidth; x++) {
				effects.forEach(function(effect) {
					var test = effect.func(x - effect.x, y - effect.y, effect.time) * 1.0;
					if (test > 0) {
						worldColors[x + y * worldWidth].r = effect.color.r * test;
						worldColors[x + y * worldWidth].g = effect.color.g * test;
						worldColors[x + y * worldWidth].b = effect.color.b * test;
						 // = (rgbToHex(255 * test, 0, 0)) ;
					}
				}); 
			}
		}
		updatePoints();
		lastFrame = now;
		renderer.render(stage);
		helsinkiCounter += delta;
		if (helsinkiCounter > 5000.0) {
			console.debug(helsinkiCounter);
			effects.push(pulse(73, 7, colorBag[getRandomInt(0, colorBag.length)], 1/60.0));
			helsinkiCounter = 0.0;
		}
	}
	requestAnimationFrame(animate);
}

function updatePoints() {
	for (var y = 0; y < worldHeight; y++) {
		for (var x = 0; x < worldWidth; x++) {
			if (world[x + y * worldWidth] === 1) {
				var sprite = sprites[x + y * worldWidth];
				sprite.tint = pointColorToHex(worldColors[x + y * worldWidth]);
			}
		}
	}
}

function onWindowResize() {
	scale = el.width()/ (cellWidth * worldWidth);
	for (var y = 0; y < worldHeight; y++) {
		for (var x = 0; x < worldWidth; x++) {
			if (world[x + y * worldWidth] === 1) {
				var sprite = sprites[x + y * worldWidth];
				sprite.position.x = x * cellWidth * scale;
				sprite.position.y = y * cellWidth * scale;

				sprite.scale.x = scale;
				sprite.scale.y = scale;
			}
		}
	}
	renderer.resize(el.width(), el.height());
	renderer.render(stage);
}

function Effect(x, y, pointColor, life, func) {
	this.x = x;
	this.y = y;
	this.color = pointColor;
	this.func = func;
	this.time = 0.0;
	this.life = life;
}
