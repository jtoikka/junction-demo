var el = $('#webgl-view');

var pixelRatio = window.devicePixelRatio || 1;

var rendererOptions = {
    antialias:true,
    transparent:false,
    resolution:pixelRatio
}

var renderer = new PIXI.autoDetectRenderer(el.width(), el.height(), rendererOptions);
renderer.backgroundColor = 0x0f0e0c;

var sprites = [];

var worldWidth = 128;
var worldHeight = 49;

var cellWidth = 32;
var halfWidth = cellWidth / 2;
var margin = 2;

var scale = el.width()/ (cellWidth * worldWidth);

var baseColor = new PointColor(35, 35, 31);

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

var locations = [
	new Location(73, 7), // Helsinki
	new Location(32, 14),// Chicago
	new Location(28, 17),// Austin
	new Location(38, 12),// Montreal
	new Location(46, 38),// Sao Paulo
	new Location(107, 32), // Bali
	new Location(74, 18), // Cairo
	new Location(20, 12),// Seattle
	new Location(91, 24), // Bengalore
	new Location(37, 14),// New York
	new Location(102, 24), // Singapore
	new Location(125, 43), // Wellington
	new Location(117, 40), // Sydney
	new Location(30, 22),// Guatemala
	new Location(76, 17), // Tel Aviv
	new Location(114, 15), // Tokyo
	new Location(104, 15), // Beijing
	new Location(99, 26), // Singapore
	new Location(90, 21), // Mumbai
	new Location(73, 14), // Istanbul
	new Location(69, 7), // Stockholm
	new Location(64, 11),// Paris
	new Location(64, 13),// Barcelona
	new Location(22, 17),// Silicon Valley
	new Location(65, 12),// London
	new Location(68, 10),// Berlin
	new Location(76, 9) // Moscow
];

var currentLocation = locations[0];

var effects = new Array();

var fps = 23.97;
var lastFrame = new Date().getTime();

initialize();
onWindowResize();
animate();

var colorBag = [
	new PointColor(251 - baseColor.r, 105 - baseColor.g, 0 - baseColor.b),
	new PointColor(12 - baseColor.r, 108 - baseColor.g, 112 - baseColor.b),
	new PointColor(220 - baseColor.r, 195 - baseColor.g, 25 - baseColor.b)
];

function initialize() {
	$(window).on('resize', onWindowResize);
	el.append(renderer.view);

	resetColours();
	effects.push(blinking(currentLocation.x, currentLocation.y, new PointColor(220 - baseColor.r, 195 - baseColor.g, 25 - baseColor.b), 1/600.0));
}

function expFalloff(t) {
	1-(t * 0.5)/(1-t*0.5);
}

var thickness = 12.0;
function pulse(x, y, color, speed) {
	return new Effect(x, y, color, 17000, function(rx, ry, t) {
		var dist = Math.sqrt(rx * rx + ry * ry);
		var st = t * speed;
		if (dist < st && dist > (st - thickness)) {
			// return expFalloff(st - dist);
			return (1 - (st - dist)/thickness) * (60.0 - st)/60.0;
		}
		return 0;
	});
}

function blinking(x, y, color, speed) {
	return new Effect(x, y, color, 11000, function(rx, ry, t) {
		var dist = Math.sqrt(rx * rx + ry * ry);
		var st = t * speed;
		if (dist < 1.0) {
			return Math.sin(st);
		}
		return 0;
	});
}

function PointColor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function Location(x, y) {
	this.x = x;
	this.y = y;
}

function resetColours() {
	for (var y = 0; y < worldHeight; y++) {
		for (var x = 0; x < worldWidth; x++) {
			worldColors[x + y * worldWidth] = new PointColor(baseColor.r, baseColor.g, baseColor.b);
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

var counter = 0.0;

function animate() {
	var now = new Date().getTime();
	var delta = now - lastFrame;
	effects.forEach(function(effect) {
		effect.time += delta;
	});
	var i = effects.length;
	while (i--) {
		if (effects[i].time >= effects[i].life && effects[i].time > 0) {
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
						worldColors[x + y * worldWidth].r += effect.color.r * test;
						worldColors[x + y * worldWidth].g += effect.color.g * test;
						worldColors[x + y * worldWidth].b += effect.color.b * test;
						if (worldColors[x + y * worldWidth].r > 255) worldColors[x + y * worldWidth].r = 255;
						if (worldColors[x + y * worldWidth].g > 255) worldColors[x + y * worldWidth].g = 255;
						if (worldColors[x + y * worldWidth].b > 255) worldColors[x + y * worldWidth].b = 255;
					}
				}); 
			}
		}
		updatePoints();
		lastFrame = now;
		renderer.render(stage);
		counter += delta;
		if (counter > 2000.0) {
			var newLocation = locations[getRandomInt(0, locations.length)];
			if (currentLocation == newLocation) {
				currentLocation = locations[getRandomInt(0, locations.length)];
			} else {
				currentLocation = newLocation;
			}
			console.debug(counter);
			var color = colorBag[getRandomInt(0, colorBag.length)];
			effects.push(pulse(currentLocation.x, currentLocation.y, color, 1/60.0));
			effects.push(blinking(currentLocation.x, currentLocation.y, color, 1/600.0));
			counter = 0.0;
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
