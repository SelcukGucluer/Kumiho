

var _requestAnimationFrame = function(win, t) {
  return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
          || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "requestAnimationFrame");



var Game = {

    
	Run: function(GameObject)
	{
	    
		Game.then = Date.now();
		Game.GameObject = GameObject;
		Game.GameObject.Init(); 
		Game.Loop();

	},
	
	
	Loop: function()
	{
		
		Game.setDelta();
		Game.GameObject.Update();
        Game.GameObject.Context.clearRect(0, 0, Game.GameObject.Canvas.width, Game.GameObject.Canvas.height);
		Game.GameObject.Draw();
		Game.animationFrame = window.requestAnimationFrame(Game.Loop);
        
	},
	
	Random: function(a,b) {return Math.floor(Math.random() * a) + b;},
	
	setDelta: function() {
		Game.now = Date.now();
		Game.delta = (Game.now - Game.then) / 1000; // seconds since last frame
		Game.then = Game.now;
	},
	
	
	Sprite: function(options) {				
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
            Game.GameObject.Context.fillStyle = that.Color;
			Game.GameObject.Context.fillRect(that.X,that.Y,that.width,that.height);
		};

    return that;
	},
    
    
    
    Controls:{
        keyPressed: {},
        MouseClick: {},
        
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
            
            if (Game.CheckCollision(x, y, w, h, SpriteCollaction[i].X, SpriteCollaction[i].Y, SpriteCollaction[i].width, SpriteCollaction[i].height) === true) {
                 return true;
             }
           
                   
        };
        return false;
           
    },
    
    CheckTwoGameObjectsCollision: function (Sprite,Sprite1) {
        var x = Sprite.X;
        var y = Sprite.Y;
        var w = Sprite.width;
        var h = Sprite.height;
                 
            if (Game.CheckCollision(x, y, w, h, Sprite1.X, Sprite1.Y, Sprite1.width, Sprite1.height) === true) {
                 return true;
             }            
   
        return false;
           
    }
    
    
};

document.addEventListener("keydown", function(e){

Game.Controls.keyPressed[e.keyCode]=true;
   
}); 

document.addEventListener("keyup", function(e){

Game.Controls.keyPressed[e.keyCode]=false;
   
}); 
