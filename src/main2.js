Math.toRadian = function(angle) {
    return angle * Math.PI / 180;
};

class Circle {
	constructor({
		radius: radius,
		origin: origin
	}) {
		this.radius = radius
		this.origin = origin;
	}

	get Radius() {
		return this.radius;
	}

	set Radius(val) {
		this.radius = val;
	}

	set Origin(val) {
		this.origin = val;
	}

	CoordonateAtAngle(angle) {
		const radianAngle = Math.toRadian(angle);
		const cosAngle = Math.cos(radianAngle);
		const sinAngle = Math.sin(radianAngle);

		return {
			x: this.origin + this.radius * cosAngle,
			y: this.origin + this.radius * sinAngle
		}
	}
}


class Effect {
	constructor(p, {
		rgbMode: rgbMode = 0,
		secondaryColor: secondaryColor = 200,
		strokeWidth: strokeWidth = 4,
		innerCircleRadius: innerCircleRadius = 20,
		cycleRate: cycleRate = 8,
		maxRadius: maxRadius = 100
	}={}) {
		this.p = p;
		this.prev = {};
		this.next = {};
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.cycleRate = cycleRate;
		this.init = {};
		this.maxRadius = maxRadius;

		this.innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: maxRadius
		});

		this.outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: maxRadius
		})
	}

	get RgbMode() { return this.rgbMode; }
	set RgbMode(val) { this.rgbMode = val; }

	get SecondaryColor() { return this.secondaryColor; }
	set SecondaryColor(val) { this.secondaryColor = val; }

	get StrokeWidth() { return this.strokeWidth; }
	set StrokeWidth(val) { this.strokeWidth = val; }

	get CycleRate() { return this.cycleRate; }
	set CycleRate(val) { this.cycleRate = val; }

	set InnerCircleRadius(val) { 
		this.innerCircle.Radius = val; 
	}

	set MaxRadius(val) { 
		this.innerCircle.Origin = val/2;
		this.outerCircle.Origin = val/2;
	}

	drawLine(lineAngle) {
			this.outerCircle.Radius = this.randomInteger(this.innerCircle.radius, this.maxRadius - this.strokeWidth)

			const start = this.innerCircle.CoordonateAtAngle(lineAngle);
			const end = this.outerCircle.CoordonateAtAngle(lineAngle);
			
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
	const effect = new Effect(p, {
		rgbMode:  0,
		secondaryColor: 200,
		strokeWidth: 4,
		circleRadius: 20,
		cycleRate: 8
	});

	
	p.setup = () => {
		const el = document.getElementById("node");
		const size = el.offsetWidth < el.offsetHeight ? el.offsetWidth: el.offsetHeight;
		effect.MaxRadius = size / 2;
		p.createCanvas(size, size);
		p.frameRate(8);
	}

	p.windowResized = () => {
		const el = document.getElementById("node");
		const size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		effect.MaxRadius = size / 2;
		p.resizeCanvas(size, size);
	}

	p.draw = () => {
		p.clear();
					
		// 360 / strokeWidth donne le nombre de ligne à générer
		for(var i = 0; i < 360; i = i + effect.StrokeWidth) {
				effect.drawLine(i);
		}
	}
}

new p5(sketch, "node");