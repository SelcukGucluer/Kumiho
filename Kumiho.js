

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
            Kumiho.GameObject.Context.fillStyle = that.Color;
			Kumiho.GameObject.Context.fillRect(that.X,that.Y,that.width,that.height);
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
            
            if (Kumiho.CheckCollision(x, y, w, h, SpriteCollaction[i].X, SpriteCollaction[i].Y, SpriteCollaction[i].width, SpriteCollaction[i].height) === true) {
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
                 
            if (Kumiho.CheckCollision(x, y, w, h, Sprite1.X, Sprite1.Y, Sprite1.width, Sprite1.height) === true) {
                 return true;
             }            
   
        return false;
           
    },
    
    Text:function(options) {				
		var that = {};
		
		that.fontsize = options.fontsize | 12;
		that.font = options.font | Georgia;
		that.X = options.X;
		that.Y = options.Y;
		that.Color = "#E88813";
        that.text = "";
        
		
		that.Draw = function(){
            Kumiho.GameObject.Context.fillStyle = that.Color;
            Kumiho.GameObject.Context.font="12px Georgia";
			Kumiho.GameObject.Context.fillText(that.text,that.X,that.Y);
		};

    return that;
	},
    

    
    
};


//Kumiho Controls object


    Kumiho.Controls = { 
        
        keyPressed: [], 
        MouseClick: false,
        
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



