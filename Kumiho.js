window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());


class Kumiho{
	constructor(CanvasID) {
		this.Canvas = document.getElementById(CanvasID);
		this.$global = {};
		this.Context = this.Canvas.getContext("2d");
		this.Camera = new Camera(this.Canvas.width,this.Canvas.height);	
		this.counter = 0;
		this.Canvas.addEventListener('mousedown', function(event) {
			alert("mouse")
		}, false);
		
		document.addEventListener('keydown', function(event) {
			alert("Keys")
		}, false);	


	}
	
	Text(options) {
	
		return new Text(this.Context,this.Camera,options);
	
	}
	
	Regtengel(options) {
	
		return new Regtengel(this.Context,this.Camera,options);
	
	}

	run(game) {
		this.then = Date.now();
		this.game = game;
		this.game.init(this.$global);
		this.loop();
	}

	loop(){
	
		this.setDelta();
		this.game.update(this.$global);
		this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		this.game.draw(this.$global);
		window.webkitRequestAnimationFrame(this.loop.bind(this));
	}

	setDelta() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000; // seconds since last frame
        this.then = this.now;
    }

	
	static random(a, b) { 
		return Math.floor(Math.random() * b) + a;
	}
	
	

}

class Camera {

	constructor(width,height) {
		this.X =  0;
		this.Y = 0;
		this.width = width;
		this.height = height;
		this.MaxW = width;
		this.MaxH = height;
		this.Speed = 10;
		this.MinX = 0;
		this.MinY = 0;

	}



    fallow(GameObject) {

        var currentX = (GameObject.x - (this.X + (this.width / 2))) + this.X;
        var currentY = (GameObject.y - (this.Y + (this.height / 2))) + this.Y;


        if (currentX >= this.MinX && currentX <= this.MaxW - this.width) {
            this.X = currentX;
        }

        if (currentY >= this.MinY && currentY <= this.MaxH - this.height) {
            this.Y = currentY;
        }

    }



};

class GameObject {
	constructor(Context,Camera,options) {
		this.Context = Context
		this.Camera = Camera
		this.w = options.width;
        this.h = options.height;
        this.speed = options.Speed;
        this.x = options.X;
        this.y = options.Y;

	}

	draw() {}
}

class Regtengel extends GameObject {
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Color =  options.Color || "#E88813" ;
	}

	draw() {
        this.Context.fillStyle = this.Color;
        this.Context.fillRect(this.x - this.Camera.X, this.y - this.Camera.Y, this.w, this.h);
    }
}

class Text extends GameObject {
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Color =  options.Color || "#E88813" ;
		this.font = options.font || "30px Arial";;
        this.message = options.message || "";
	}

    draw () {
        this.Context.font = this.font;
        this.Context.fillStyle = this.Color;
        this.Context.fillText(this.message, this.x, this.y);

    };

}


class SpriteCollaction {

	constructor() {
        this.SpriteArray = [];
	}


    add (sprite) {
          this.SpriteArray.push(sprite);
    }

    each (f) {

        for (var i = 0; i < this.SpriteArray.length; i++) {
            let s = this.SpriteArray[i];
            f(s);
		}

   }

   eachWhitIndex (f) {

        for (var i = 0; i < this.SpriteArray.length; i++) {
            let s = this.SpriteArray[i];
            f(s, i);
        }

   }

    remove (sprite) {

        for (var i = this.SpriteArray.length - 1; i >= 0; i--) {

            if (this.SpriteArray[i] == sprite) {
                this.SpriteArray.splice(i, 1);
            }
        }
    }

    draw() {

        for (var i = 0; i < this.SpriteArray.length; i++) {
              this.SpriteArray[i].draw();
        }

    };

    get (index) {

        return this.SpriteArray[index];

    }


    checkCollision (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1) { return true; }
        return false;
    }

}