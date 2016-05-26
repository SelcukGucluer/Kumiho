var _requestAnimationFrame = function(win, t) {
  return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
          || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "requestAnimationFrame");



var Kumiho = {

    
	Run: function(GameObject)
	{
	    
		Kumiho.then = Date.now();
		Kumiho.GameObject = GameObject;
		Kumiho.GameObject.Init(); 
		Kumiho.Loop();

	},
	
	
	Loop: function()
	{
		
		Kumiho.setDelta();
		Kumiho.GameObject.Update();
        Kumiho.GameObject.Context.clearRect(0, 0, Kumiho.GameObject.Canvas.width, Kumiho.GameObject.Canvas.height);
		Kumiho.GameObject.Draw();
		Kumiho.animationFrame = window.requestAnimationFrame(Kumiho.Loop);
        
	},
	
	Random: function(a,b) {return Math.floor(Math.random() * a) + b;},
	
	setDelta: function() {
		Kumiho.now = Date.now();
		Kumiho.delta = (Kumiho.now - Kumiho.then) / 1000; // seconds since last frame
		Kumiho.then = Kumiho.now;
	},
	
	
	Rectangle: function(options) {				
		var that = {};
		that.width = options.width;
		that.height = options.height;
		that.Speed = options.Speed;
		that.X = options.X;
		that.Y = options.Y;
		that.Color = "#E88813";
        
		that.calcDistance = function(del) {
			return (that.Speed * del);
		}
		
		
		that.Draw = function(){
			
            Kumiho.GameObject.Context.fillStyle = that.Color;
			Kumiho.GameObject.Context.fillRect(that.X,that.Y,that.width,that.height);		
			
		};

    return that;
	},
    
   
    AnimatedSprite: function(options) {				
		var that = {};
        
        that.Speed = options.Speed;
		that.X = options.X;
		that.Y = options.Y;
        
        that.Animations = [];
        that.CurrentAnimation = 0;
		
		that.AddAnimation = function(Animation){
           that.Animations.push(Animation);
		};
        
         that.size = function(){
            return that.Animations.length;
		};
        
		
		that.update = function () {
            
           that.Animations[that.CurrentAnimation].update();
        };
		
		
		
		that.Draw = function(){
			that.Animations[that.CurrentAnimation].render(that.X ,that.Y);
		};

    return that;
	},
    
    
    Animate: function (options) {
	
		var that = {}, frameIndex = 0, tickCount = 0,ticksPerFrame=0;
            

        that.numberOfFrames = options.numberOfFrames || 1;	
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
        that.ticksPerSec = options.ticksPerSec;
		
		that.update = function () {
            
            ticksPerFrame = that.ticksPerSec * Kumiho.delta;
            tickCount += 1;

            if (tickCount > ticksPerFrame) {
				tickCount = 0;
                // If the current frame index is in range
                if (frameIndex < that.numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };
		
		that.render = function (x,y) {
		  // Draw the animation
		  Kumiho.GameObject.Context.drawImage(
		    that.image,
		    frameIndex * that.width / that.numberOfFrames,
		    0,
		    that.width / that.numberOfFrames,
		    that.height,
		    x,
		    y,
		    that.width / that.numberOfFrames,
		    that.height);
		};
		
		return that;
	},

    
    	
	Text: function(options) {				
		var that = {};
		
   
		that.font = options.font;
		that.X = options.X;
		that.Y = options.Y;
        that.message = options.message;
		that.Color = "#E88813";
		
		that.Draw = function(){
                    
            Kumiho.GameObject.Context.font=that.font;
            Kumiho.GameObject.Context.fillStyle = that.Color;
            Kumiho.GameObject.Context.fillText(that.message,that.X,that.Y);
            
		};

    return that;
	},
        

    CheckCollision: function (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1) { return true; }
            return false;
        },
        
        
    CheckCollisionInCollaction: function (Sprite,SpriteCollaction) {
        var x = Sprite.X;
        var y = Sprite.Y;
        var w = Sprite.width;
        var h = Sprite.height;
        
        for (var i = 0; i < SpriteCollaction.length ; i++) { 
            
       if(SpriteCollaction.indexOf(Sprite) !== i){
            if (Kumiho.CheckCollision(x, y, w, h, SpriteCollaction[i].X, SpriteCollaction[i].Y, SpriteCollaction[i].width, SpriteCollaction[i].height) === true) {
                 return true;
             }
        }
           
                   
        }
        return false;
           
    },
    
    CheckTwoGameObjectsCollision: function (Sprite,Sprite1) {
        var x = Sprite.X;
        var y = Sprite.Y;
        var w = Sprite.width;
        var h = Sprite.height;
                 
            if (Kumiho.CheckCollision(x, y, w, h, Sprite1.X, Sprite1.Y, Sprite1.width, Sprite1.height) === true) {
                 return true;
             }            
   
        return false;
           
    },
    
    
};


//Kumiho Controls object


    Kumiho.Controls = { 
        
        keyPressed: [], 
        MouseClick: false,
		MouseX: 0,
		MouseY: 0,
        
        keydown: function(e){
          Kumiho.Controls.keyPressed[e.keyCode]=true;  
        },
        
        keyup: function(e){
          Kumiho.Controls.keyPressed[e.keyCode]=false;  
        },
        
        Mousedown: function(e){
          Kumiho.Controls.MouseClick = true;  
        },
        
        Mouseup: function(e){
          Kumiho.Controls.MouseClick = false;  
        },
		
    };

    


//Kumiho Event Listeners

document.addEventListener("keydown", Kumiho.Controls.keydown); 
document.addEventListener("keyup", Kumiho.Controls.keyup);
document.addEventListener("mousedown", Kumiho.Controls.Mousedown); 
document.addEventListener("mouseup", Kumiho.Controls.Mouseup);



