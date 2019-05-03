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
		this.$global = {};
		
		this.input = {

			keyPressed : [],
			
			MouseX : 0,
			MouseY : 0,
			
			MouseClick : false,
			
			keydown: function(e) {
				this.input.keyPressed[e.keyCode] = true;
			},

			keyup: function(e) {
				this.input.keyPressed[e.keyCode] = false;
			},

			mousedown: function(e) {
				this.input.MouseClick = true;
				this.input.MouseX = e.clientX;
				this.input.MouseY = e.clientY;
			},

			mouseup: function(e) {
				this.input.MouseClick = false;
				this.input.MouseX = 0;
				this.input.MouseY = 0;
			},

		};
		

		this.Context = this.Canvas.getContext("2d");
		this.Camera = new Camera(this.Canvas.width,this.Canvas.height);	
		this.counter = 0;
		
		thisAddEventListener(document, "keydown", this.input.keydown, this);
		thisAddEventListener(document, "keyup", this.input.keyup, this);
		thisAddEventListener(this.Canvas, "mousedown", this.input.mousedown, this);
		thisAddEventListener(this.Canvas, "mouseup", this.input.mouseup, this);


	}
	
	Text (options) {return new Text(this.Context,this.Camera,options);}
	
	Regtengel (options) {return new Regtengel(this.Context,this.Camera,options);}
	
	Scene (Image) {return new Scene(this.Canvas,this.Context,this.Camera,Image);}
	
	Tileset (options) {return new Tileset(this.Canvas,this.Context,this.Camera,options);}
	
	Sprite (options) {return new Sprite(this.Canvas,this.Context,this.Camera,options);}
	
	TileMap (options) {return new TileMap(this.Canvas,this.Context,this.Camera,options);}
	
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
		this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
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

class Sprite extends GameObject {
	 
	constructor(Canvas,Context,Camera,options) {
		super(Context,Camera, options);
        this.tileset = options.tileset;
		this.tileIndex = options.tileIndex;
		this.tileset.x = this.x
		this.tileset.y = this.y
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

	constructor(Canvas,Context,Camera,options) {
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

    constructor(Canvas,Context,Camera,options) {

        this.cols = options.map.cols;
        this.rows = options.map.rows;
        this.tiles = options.map.tiles;
		this.Canvas	= Canvas;
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

						new Sprite(this.Canvas,this.Context,this.Camera,{
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


  /*  AnimatedSprite: function(options) {
        var that = {};

        that.Speed = options.Speed;
        that.X = options.X;
        that.Y = options.Y;

        that.Animations = [];
        that.CurrentAnimation = 0;

        that.AddAnimation = function(Animation) {
            that.Animations.push(Animation);
        };

        that.length = function() {
            return that.Animations.length;
        };


        that.update = function() {

            that.Animations[that.CurrentAnimation].update();

        };


        that.Draw = function() {
            that.Animations[that.CurrentAnimation].render(that.X, that.Y);
        };

        return that;
    }*/


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

