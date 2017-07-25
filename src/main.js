var soundEffect = (function(p5) {
		var s = function(p) {
			
			var prev = {};
			var init = {};

			var rgbMode, secondaryColor, strokeWidth, circleRadius, cycleRate = 0;

			p.init = function(settings) {
					p.setStrokeWidth(settings.strokeWidth || 4);
					p.setSecondaryColor(settings.secondaryColor || 100);
					p.setRGBMode(settings.rgbMode || 0)
					p.setCircleRadius(settings.circleRadius || 20);
					p.setCycleRate(settings.cycleRate || 8);
			}

			p.setStrokeWidth = function(width) {
					strokeWidth = width;
			}

			p.setSecondaryColor = function(color) {
					secondaryColor = color;
			}

			p.setRGBMode = function(mode) {
					rgbMode = mode;
			}

			p.setCircleRadius = function(radius) {
					circleRadius = radius
			}

			p.setCycleRate = function(rate) {
					cycleRate = rate;
			}

			p.setup = function() {
				p.init({});
				var el = document.getElementById("node");
					size = el.offsetWidth < el.offsetHeight ? el.offsetWidth: el.offsetHeight;
					halfSize = size / 2;
					p.createCanvas(size, size);
					p.frameRate(8);
			};

			p.windowResized = function() {
				var el = document.getElementById("node");
					size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
					halfSize = size / 2;
					p.resizeCanvas(size, size);
			}

			p.draw = function() {
					p.clear();
					
					// 360 / strokeWidth donne le nombre de ligne à générer
					for(var i = 0; i < 360; i = i + strokeWidth) {
							drawLine(i, strokeWidth, rgbMode, secondaryColor);
					}
					p.line(prev.x, prev.y, init.x, init.y);
					
			};

			drawLine = function(lineAngle, strokeWidth, rgbMode, secondaryColor) {
					// dépasse pas les limites de l'écran
					var lineLength = randomInteger(circleRadius, p.height / 2 - strokeWidth);
					
					// point milieu de l'écran
					var init = halfSize;
					
					// point correspondant à l'angle entre le milieu, et le premier cercle imaginaire
					var start = {
							x: (init + circleRadius / 2 * Math.cos(lineAngle * Math.PI / 180)),
							y: (init + circleRadius / 2 * Math.sin(lineAngle * Math.PI / 180))
					};
					
					// point correspondant à l'angle entre le milieu, et le deuxième cercle imaginaire
					var end = {
							x: (init + lineLength * Math.cos(lineAngle * Math.PI / 180)),
							y: (init + lineLength * Math.sin(lineAngle * Math.PI / 180))
					}
					
					if (lineAngle == 0) {
							init.x = end.x;
							init.y = end.y;
					} else {
							p.line(prev.x, prev.y, end.x, end.y);
					}

					// dessine la ligne
					p.strokeWeight(strokeWidth);
					p.stroke(getRandomColor(rgbMode, secondaryColor));
					p.line(start.x, start.y, end.x, end.y);
					
					// Keep track of the ending coordonates
					prev.x = end.x;
					prev.y = end.y;
			}
			
			getRandomColor = function(rgbMode, secondaryColor) {
					if (rgbMode == 0) {
							return p.color(randomInteger(0, 256), secondaryColor, secondaryColor);
					} else if (rgbMode == 1) {
							return p.color(secondaryColor, randomInteger(0, 256), secondaryColor);
					} else {
							return p.color(secondaryColor, secondaryColor, randomInteger(0, 256));
					}
			};
			
			randomInteger = function(min, max) {
					return Math.random() * (max - min) + min;
			};
	};

	new p5(s, "node");
})(p5);