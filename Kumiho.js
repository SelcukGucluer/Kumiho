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


 thisAddEventListener = function(element, eventName, eventHandler, scope){
	 
        var scopedEventHandler = scope ? function(e) { eventHandler.apply(scope, [e]); } : eventHandler;
        if(document.addEventListener)
            element.addEventListener(eventName, scopedEventHandler, false);
        else if(document.attachEvent)
            element.attachEvent("on"+eventName, scopedEventHandler);
    }


class Kumiho{
	constructor(CanvasID) {
		this.Canvas = document.getElementById(CanvasID);
		this.Context = this.Canvas.getContext("2d");
		this.Camera = new Camera(this.Canvas.width,this.Canvas.height);
		this.input = new Input(this.Canvas);
		this.$global = {};
	}
	
	Text (options) {return new Text(this.Context,this.Camera,options);}
	Regtengel (options) {return new Regtengel(this.Context,this.Camera,options);}
	Circle (options) {return new Circle(this.Context,this.Camera,options);}
	Scene (Image) {return new Scene(this.Canvas,this.Context,this.Camera,Image);}
	Tileset (options) {return new Tileset(this.Context,this.Camera,options);}
	Sprite (options) {return new Sprite(this.Context,this.Camera,options);}
	AnimatedSprite (options) {return new AnimatedSprite(this.Context,this.Camera,options);}
	TileMap (options) {return new TileMap(this.Context,this.Camera,options);}
	Animation (options) {return new Animation(this.Canvas,this.Context,this.Camera,options);}
	
	
	run(game) {
		this.then = Date.now();
		this.game = game;
		this.game.init(this.$global);
		this.loop();
	}

	loop(){
		this.setDelta();
		this.game.update(this.$global);
		this.Context.fillStyle = "#ccf2ff";
		this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
		//this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		this.game.draw(this.$global);
		window.requestAnimationFrame(this.loop.bind(this));
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
		this.X = 0;
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
		this.r = options.r;

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


class Circle extends GameObject {
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Color =  options.Color || "#E88813" ;
	}

	draw() {
        this.Context.beginPath();
		this.Context.lineWidth = 1;
		this.Context.arc(this.x ,this.y,this.r,0, 2*Math.PI);
		this.Context.fillStyle = 'yellow';
		this.Context.fill();
		this.Context.stroke();
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

class Sprite extends GameObject {
	 
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
        this.tileset = options.tileset;
		this.tileIndex = options.tileIndex;
		this.tileset.x = this.x;
		this.tileset.y = this.y;
	}
		

    draw () {
		this.tileset.x = this.x - this.Camera.X;
		this.tileset.y = this.y - this.Camera.Y;
		this.tileset.draw(this.tileIndex)
    }
}

class Scene  {
	
	constructor(Canvas,Context,Camera,Image) {
		this.Canvas	= Canvas;
		this.Context = Context
		this.Camera = Camera
		this.Image =  Image;
		this.w = this.Image.width;
        this.h = this.Image.height;
		this.speed =  50;

	}	

    draw () {
	
        this.Context.drawImage(
        this.Image,
       (this.Camera.X * this.speed) / 100,
       (this.Camera.Y * this.speed) / 100,
        this.Canvas.width,
        this.Canvas.height,
        0,
        0,
        this.Canvas.width,
        this.Canvas.height);

    }

};

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

class Tileset {

	constructor(Context,Camera,options) {
		this.image = options.image;
        this.cols = options.cols;
        this.rows = options.rows;
		this.tileSize = options.tileSize;
		
		this.Context = Context;
		this.Camera = Camera;
		this.x = 0;
		this.y = 0;
	}

    getCoordinate (value) {

		var xy = {};
			
		if(value == this.rows * this.cols)
		{
				xy.y = this.rows -1
				xy.x = this.cols -1					
		}			
		
		if(value > this.cols)
		{
		
			if(value % this.cols > 0)
			{
				xy.y = Math.floor(value / this.cols);
				xy.x = value % this.cols -1;					
			}
			else
			{
				xy.y = Math.floor(value / this.cols)-1;
				xy.x = this.cols-1;					
			}
				
		}
		else
		{
			xy.y = 0
			xy.x = value -1;
		}


        return xy;
    }

    draw (tileIndex) {
		var Cor = this.getCoordinate(tileIndex)
		this.Context.drawImage(
		this.image,
		Cor.x * this.tileSize,
		Cor.y * this.tileSize,
		this.tileSize,
		this.tileSize,
		this.x,
		this.y,
		this.tileSize,
		this.tileSize);
    }
	

}

class TileMap {

    constructor(Context,Camera,options) {

        this.cols = options.map.cols;
        this.rows = options.map.rows;
        this.tiles = options.map.tiles;
		this.Context = Context
		this.Camera = Camera
        this.Collaction = new SpriteCollaction();
		this.tileset = options.tileset;

        this.Camera.MaxW = this.cols * this.tileset.tileSize;
        this.Camera.MaxH = this.rows * this.tileset.tileSize;

        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.GetTile(c, r);
                if (tile !== 0) {

                    this.Collaction.add(

						new Sprite(this.Context,this.Camera,{
							X: c * this.tileset.tileSize, 
							Y: r * this.tileset.tileSize, 
							Speed:100,
							tileset: this.tileset,
							tileIndex: tile})
						);

                }
            }
        }


    }

    GetTile (col, row) {
        return this.tiles[row * this.cols + col];
    }

    SetTile (col, row, value) {
        this.tiles[row * this.cols + col] = value;
    }

    Remove (col, row) {
        this.SetTile(col, row, 0);
        //Kumiho.TileMap.Collction.Remove();
    }

    Draw () {
        this.Collaction.draw();
    }

};

class AnimatedSprite extends GameObject {
	 
    constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Animations = [];
        this.CurrentAnimation = 0;
		
	}


    AddAnimation (Animation) {
        this.Animations.push(Animation);
    };

    length() {
        return this.Animations.length;
    };


    update(delta) {
		this.Animations[this.CurrentAnimation].update(delta);
    };


    draw() {
        this.Animations[this.CurrentAnimation].draw(this.x, this.y);
    };

}

class Animation {

	constructor(Canvas,Context,Camera,options) {
		this.numberOfFrames = options.numberOfFrames || 1;
		this.tileset = options.tileset;
		this.indexArray = options.indexArray;
        this.ticksPerSec = options.ticksPerSec;
		this.frameIndex = 0;
        this.currentposition = 0;
        this.LastFrame = false;
		this.Loop = options.Loop;
		this.Camera = Camera;
	}
	
    update (delta) {
        this.currentposition += delta;
        if (this.currentposition > (this.numberOfFrames / this.ticksPerSec)) { this.currentposition = this.currentposition - (this.numberOfFrames / this.ticksPerSec) }
    };

    draw (x, y) {
        this.frameIndex = Math.floor(this.currentposition * this.ticksPerSec);

		this.tileset.x = x - this.Camera.X;
		this.tileset.y = y - this.Camera.Y;
		this.tileset.draw(this.indexArray[this.frameIndex]);
    }

}

class Input{
	constructor(Canvas){
		this.keyPressed = [];
		this.MouseX = 0;
		this.MouseY = 0;
		this.MouseClick = false;
		this.Canvas = Canvas;
		this.key = { backspace: 8, tab: 9, enter: 13, shiftleft: 16, shiftright: 16, ctrlleft: 17, ctrlrigght: 17, altleft: 18, altright: 18, pause: 19, capslock: 20, escape: 27, pageup: 33, pagedown: 34, end: 35, home: 36, arrowleft: 37, arrowup: 38, arrowright: 39, arrowdown: 40, insert: 45, delete: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88,  y: 89, z: 90, metaleft: 91, metaright: 92, select: 93, numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99, numpad4: 100, numpad5: 101, numpad6: 102, numpad7: 103, numpad8: 104, numpad9: 105, numpadmultiply: 106, numpadadd: 107, numpadsubtract: 109, numpaddecimal: 110, numpaddivide: 111, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    equalsign: 187,
    comma: 188,
    minus: 189,
    period: 190,
    slash: 191,
    backquote: 192,
    bracketleft: 219,
    backslash: 220,
    braketright: 221,
    quote: 222
  };
					
		thisAddEventListener(document, "keydown", this.keydown, this);
		thisAddEventListener(document, "keyup", this.keyup, this);
		thisAddEventListener(this.Canvas, "mousedown", this.mousedown, this);
		thisAddEventListener(this.Canvas, "mouseup", this.mouseup, this);
	}
				
	keydown (e) {
		this.keyPressed[e.keyCode] = true;
	}

	keyup (e) {
		this.keyPressed[e.keyCode] = false;
	}

	mousedown (e) {
		this.MouseClick = true;
		this.MouseX = e.clientX;
		this.MouseY = e.clientY;
	}

	mouseup (e) {
		this.MouseClick = false;
		this.MouseX = 0;
		this.MouseY = 0;
	}		
		
}

class Collision {
	
	constructor() {
		
	}
	
	circleCircle(sprite1, sprite2) {

		// get distance between the circle's centers
		// use the Pythagorean Theorem to compute the distance
		distX = sprite1.x - sprite2.x;
		distY = sprite1.y - sprite2.y;
		distance = Math.sqrt( (distX*distX) + (distY*distY) );

		// if the distance is less than the sum of the circle's
		// radii, the circles are touching!
		if (distance <= sprite1.r+sprite2.r) {
			return true;
		}
		return false;
	}
	
	
	rectRect(sprite1 , sprite2) {

		// are the sides of one rectangle touching the other?

		if (sprite1.x + sprite1.w >= sprite2.x &&    // r1 right edge past r2 left
			sprite1.x <= sprite2.x + sprite2.w &&    // r1 left edge past r2 right
			sprite1.y + sprite1.h >= sprite2.y &&    // r1 top edge past r2 bottom
			sprite1.y <= sprite2.y + sprite2.h) {    // r1 bottom edge past r2 top
			return true;
		}
		return false;
	}
	
	circleRect(sprite1 ,sprite2) {

		// temporary variables to set edges for testing
		testX = sprite1.x;
		testY = sprite1.y;

		// which edge is closest?
		if (sprite1.x < sprite2.x)         testX = sprite2.x;      // test left edge
		else if (sprite1.x > sprite2.x+sprite2.w) testX = sprite2.x+sprite2.w;   // right edge
		if (sprite1.y < sprite2.y)         testY = sprite2.y;      // top edge
		else if (sprite1.y > sprite2.y+sprite2.h) testY = sprite2.y+sprite2.h;   // bottom edge

		// get distance from closest edges
		distX = sprite1.x-testX;
		distY = sprite1.y-testY;
		distance = sqrt( (distX*distX) + (distY*distY) );

		// if the distance is less than the radius, collision!
		if (distance <= sprite1.r) {
			return true;
		}
		return false;
	}
	
}
