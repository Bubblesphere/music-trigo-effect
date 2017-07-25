class Circle {
	constructor(p, {
		rgbMode: rgbMode = 0,
		secondaryColor: secondaryColor = 200,
		strokeWidth: strokeWidth = 4,
		circleRadius: circleRadius = 20,
		cycleRate: cycleRate = 8,
		halfSize: halfSize = 100
	}={}) {
		this.p = p;
		this.prev = {};
		this.next = {};
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.circleRadius = circleRadius;
		this.cycleRate = cycleRate;
		this.halfSize = halfSize;
		this.init = {};
	}

	get RgbMode() { return this.rgbMode; }
	set RgbMode(val) { this.rgbMode = val; }

	get SecondaryColor() { return this.secondaryColor; }
	set SecondaryColor(val) { this.secondaryColor = val; }

	get StrokeWidth() { return this.strokeWidth; }
	set StrokeWidth(val) { this.strokeWidth = val; }

	get CircleRadius() { return this.circleRadius; }
	set CircleRadius(val) { this.circleRadius = val; }

	get CycleRate() { return this.cycleRate; }
	set CycleRate(val) { this.cycleRate = val; }

	get HalfSize() { return this.halfSize; }
	set HalfSize(val) { this.halfSize = val; }

	drawLine(lineAngle) {
			// dépasse pas les limites de l'écran
			const lineLength = this.randomInteger(this.circleRadius, this.p.height / 2 - this.strokeWidth);
			
			// point correspondant à l'angle entre le milieu, et le premier cercle imaginaire
			const start = {
					x: (this.halfSize + this.circleRadius / 2 * Math.cos(lineAngle * Math.PI / 180)),
					y: (this.halfSize + this.circleRadius / 2 * Math.sin(lineAngle * Math.PI / 180))
			};
			
			// point correspondant à l'angle entre le milieu, et le deuxième cercle imaginaire
			const end = {
					x: (this.halfSize + lineLength * Math.cos(lineAngle * Math.PI / 180)),
					y: (this.halfSize + lineLength * Math.sin(lineAngle * Math.PI / 180))
			}
			
			if (lineAngle == 0) {
					this.init.x = end.x;
					this.init.y = end.y;
			} else {
					this.p.line(this.prev.x, this.prev.y, end.x, end.y);
			}

			// dessine la ligne
			this.p.strokeWeight(this.strokeWidth);
			this.p.stroke(this.getRandomColor());
			this.p.line(start.x, start.y, end.x, end.y);
			
			// Keep track of the ending coordonates
			this.prev.x = end.x;
			this.prev.y = end.y;

			if (lineAngle + this.strokeWidth > 359) {
				this.p.line(this.prev.x, this.prev.y, this.init.x, this.init.y);
			}
	}

	getRandomColor() {
		if (this.rgbMode == 0) {
			return this.p.color(this.randomInteger(0, 256), this.secondaryColor, this.secondaryColor);
		} else if (this.rgbMode == 1) {
			return this.p.color(secondaryColor, this.randomInteger(0, 256), this.secondaryColor);
		} else {
			return this.p.color(this.secondaryColor, this.secondaryColor, this.randomInteger(0, 256));
		}
	}

	randomInteger(min, max) {
			return Math.random() * (max - min) + min;
	};
}	

var sketch = function(p) {
	const circle = new Circle(p, {
		rgbMode:  0,
		secondaryColor: 200,
		strokeWidth: 4,
		circleRadius: 20,
		cycleRate: 8
	});

	
	p.setup = () => {
		const el = document.getElementById("node");
		const size = el.offsetWidth < el.offsetHeight ? el.offsetWidth: el.offsetHeight;
		circle.HalfSize = size / 2;
		p.createCanvas(size, size);
		p.frameRate(8);
	}

	p.windowResized = () => {
		const el = document.getElementById("node");
		const size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		circle.HalfSize = size / 2;
		p.resizeCanvas(size, size);
	}

	p.draw = () => {
		p.clear();
					
		// 360 / strokeWidth donne le nombre de ligne à générer
		for(var i = 0; i < 360; i = i + circle.StrokeWidth) {
				circle.drawLine(i);
		}

		//
	}
}

new p5(sketch, "node");