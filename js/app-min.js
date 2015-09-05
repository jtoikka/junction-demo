var el=$("#webgl-view"),pixelRatio=window.devicePixelRatio||1,rendererOptions={antialias:!0,transparent:!1,resolution:pixelRatio},renderer=new PIXI.autoDetectRenderer(el.width(),el.height(),rendererOptions);renderer.backgroundColor=986636;
for(var sprites=[],worldWidth=128,worldHeight=49,cellWidth=32,halfWidth=cellWidth/2,margin=2,scale=el.width()/(cellWidth*worldWidth),baseColor=new PointColor(35,35,31),worldColors=[],stage=new PIXI.Container(16777215),y=0;y<worldHeight;y++)for(var x=0;x<worldWidth;x++)if(1===world[x+y*worldWidth]){var sprite=PIXI.Sprite.fromImage("images/circle.png");sprite.position.x=x*cellWidth*scale;sprite.position.y=y*cellWidth*scale;sprite.scale.x=scale;sprite.scale.y=scale;stage.addChild(sprite);sprites.push(sprite)}else sprites.push("");
var locations=[new Location(73,7),new Location(32,14),new Location(28,17),new Location(38,12),new Location(46,38),new Location(107,32),new Location(74,18),new Location(20,12),new Location(91,24),new Location(37,14),new Location(102,24),new Location(125,43),new Location(117,40),new Location(30,22),new Location(76,17),new Location(114,15),new Location(104,15),new Location(99,26),new Location(90,21),new Location(73,14),new Location(69,7),new Location(64,11),new Location(64,13),new Location(22,17),new Location(65,
12),new Location(68,10),new Location(76,9)],currentLocation=locations[0],effects=[],fps=23.97,lastFrame=(new Date).getTime();initialize();onWindowResize();animate();var colorBag=[new PointColor(251-baseColor.r,105-baseColor.g,0-baseColor.b),new PointColor(12-baseColor.r,108-baseColor.g,112-baseColor.b),new PointColor(220-baseColor.r,195-baseColor.g,25-baseColor.b)];
function initialize(){$(window).on("resize",onWindowResize);el.append(renderer.view);resetColours();effects.push(blinking(currentLocation.x,currentLocation.y,new PointColor(220-baseColor.r,195-baseColor.g,25-baseColor.b),1/600))}function expFalloff(a){1-.5*a/(1-.5*a)}var thickness=12;function pulse(a,b,c,d){return new Effect(a,b,c,17E3,function(a,b,c){a=Math.sqrt(a*a+b*b);c*=d;return a<c&&a>c-thickness?(1-(c-a)/thickness)*(60-c)/60:0})}
function blinking(a,b,c,d){return new Effect(a,b,c,11E3,function(a,b,c){a=Math.sqrt(a*a+b*b);c*=d;return 1>a?Math.sin(c):0})}function PointColor(a,b,c){this.r=a;this.g=b;this.b=c}function Location(a,b){this.x=a;this.y=b}function resetColours(){for(var a=0;a<worldHeight;a++)for(var b=0;b<worldWidth;b++)worldColors[b+a*worldWidth]=new PointColor(baseColor.r,baseColor.g,baseColor.b)}function rgbToHex(a,b,c){return(a<<16)+(b<<8)+c}function pointColorToHex(a){return rgbToHex(a.r,a.g,a.b)}
function getRandomInt(a,b){return Math.floor(Math.random()*(b-a))+a}var counter=0;
function animate(){var a=(new Date).getTime(),b=a-lastFrame;effects.forEach(function(a){a.time+=b});for(var c=effects.length;c--;)effects[c].time>=effects[c].life&&0<effects[c].time&&effects.splice(c,1);if(b>=1E3/fps){resetColours();for(var d=0;d<worldHeight;d++)for(var e=0;e<worldWidth;e++)effects.forEach(function(a){var b=1*a.func(e-a.x,d-a.y,a.time);0<b&&(worldColors[e+d*worldWidth].r+=a.color.r*b,worldColors[e+d*worldWidth].g+=a.color.g*b,worldColors[e+d*worldWidth].b+=a.color.b*b,255<worldColors[e+
d*worldWidth].r&&(worldColors[e+d*worldWidth].r=255),255<worldColors[e+d*worldWidth].g&&(worldColors[e+d*worldWidth].g=255),255<worldColors[e+d*worldWidth].b&&(worldColors[e+d*worldWidth].b=255))});updatePoints();lastFrame=a;renderer.render(stage);counter+=b;2E3<counter&&(a=locations[getRandomInt(0,locations.length)],currentLocation=currentLocation==a?locations[getRandomInt(0,locations.length)]:a,console.debug(counter),a=colorBag[getRandomInt(0,colorBag.length)],effects.push(pulse(currentLocation.x,
currentLocation.y,a,1/60)),effects.push(blinking(currentLocation.x,currentLocation.y,a,1/600)),counter=0)}requestAnimationFrame(animate)}function updatePoints(){for(var a=0;a<worldHeight;a++)for(var b=0;b<worldWidth;b++)1===world[b+a*worldWidth]&&(sprites[b+a*worldWidth].tint=pointColorToHex(worldColors[b+a*worldWidth]))}
function onWindowResize(){scale=el.width()/(cellWidth*worldWidth);for(var a=0;a<worldHeight;a++)for(var b=0;b<worldWidth;b++)if(1===world[b+a*worldWidth]){var c=sprites[b+a*worldWidth];c.position.x=b*cellWidth*scale;c.position.y=a*cellWidth*scale;c.scale.x=scale;c.scale.y=scale}renderer.resize(el.width(),el.height());renderer.render(stage)}function Effect(a,b,c,d,e){this.x=a;this.y=b;this.color=c;this.func=e;this.time=0;this.life=d};