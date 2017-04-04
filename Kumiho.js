
var _requestAnimationFrame = function(win, t) {
  return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
          || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "requestAnimationFrame");



var Kumiho = {

    
	Run: function(GameObject)
	{
		
		Kumiho.then = Date.now();
		Kumiho.GameObject = GameObject;
		Kumiho.Camera.MaxW = Kumiho.GameObject.Canvas.width;
		Kumiho.Camera.MaxH = Kumiho.GameObject.Canvas.height;
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
		that.w = options.width;
		that.h = options.height;
		that.Speed = options.Speed;
		that.x = options.X;
		that.y = options.Y;
		that.Color = "#E88813";
		that.Distance = function(){ return that.Speed * Kumiho.delta }
		
		that.Draw = function(){

				Kumiho.GameObject.Context.fillStyle = that.Color;
				Kumiho.GameObject.Context.fillRect(that.x - Kumiho.Camera.X,that.y - Kumiho.Camera.Y,that.w,that.h);		

		};

    return that;
	},
	
	Sprite: function(options) {	

    	CalCoordinate = function(value){

            var xy={};

			for (var r = 0; r < that.rows ;r++) {
			
			    if( that.cols * r >= value && (that.cols -(that.cols * r - value)) > -1)
                {
                    xy.y = r -1 ;
                    xy.x = that.cols -(that.cols * r - value) -1;
			
	    		}
            }

               return xy;
		};

		var that = {};
		that.w = options.width;
		that.h = options.height;
		that.Speed = options.Speed;
		that.x = options.X;
		that.y = options.Y;
        that.image = options.image;
		that.Distance = function(){ return that.Speed * Kumiho.delta }
		that.cols = options.cols;
        that.rows = options.rows;
        that.tileIndex = options.tileIndex;
    
		
		that.Draw = function () {
            var Cor = CalCoordinate(that.tileIndex)


				Kumiho.GameObject.Context.drawImage(
				that.image,
				Cor.x * that.w,
				Cor.y * that.h,
				that.w -2,
				that.h -2,
				that.x - Math.round(Kumiho.Camera.X),
				that.y - Math.round(Kumiho.Camera.Y),
				that.w,
				that.h );
			
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
        
         that.length = function(){
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
	
        var that = {}, frameIndex = 0, currentposition = 0,LastFrame = false;
            
        that.numberOfFrames = options.numberOfFrames || 1;	
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		that.Loop = options.Loop;
		that.Index = options.Index;
        that.ticksPerSec = options.ticksPerSec;
		
		that.update = function () {
            currentposition += Kumiho.delta;
            if (currentposition  > (that.numberOfFrames / that.ticksPerSec) ) { currentposition =  currentposition - (that.numberOfFrames / that.ticksPerSec) }
        };
		
		that.render = function (x,y) {
            
            frameIndex = Math.floor(currentposition * that.ticksPerSec);

		    Kumiho.GameObject.Context.drawImage(
		    that.image,
		    frameIndex * that.width,
		    that.Index * that.height,
		    that.width,
		    that.height,
		    x,
		    y,
		    that.width,
		    that.height);
		};
		
		return that;
	},

    	
	Text: function(options) {				
		var that = {};
		
   
		that.font = options.font || "30px Arial";;
		that.X = options.X;
		that.Y = options.Y;
        that.message = options.message || "";
		that.Color = "#E88813";
		
		that.Draw = function(){
                    
            Kumiho.GameObject.Context.font=that.font;
            Kumiho.GameObject.Context.fillStyle = that.Color;
            Kumiho.GameObject.Context.fillText(that.message,that.X,that.Y);
            
		};

    return that;
	},
	
	
	
	SpriteCollaction: function(){
		var that = {};
		that.Collision = {};
		that.SpriteArray = [];
		
		args = {
			// mandatory fields
			x : 0,
			y : 0,
			w : Kumiho.GameObject.Canvas.width,
			h : Kumiho.GameObject.Canvas.height,

			// optional fields
			maxChildren : 8,
			maxDepth : 4
		};

		that.tree = QUAD.init(args);
		
		
		
		
		that.Add = function(sprite){

			if(!Array.isArray(sprite))
			{
				that.SpriteArray.push(sprite);
				that.tree.insert(sprite);
            }
		};
		
		that.Collision = function(sprite,f){
			

			that.tree.retrieve(sprite, function(item) {
			
				if( item != sprite) {
					if (Kumiho.CheckCollision(sprite.x, sprite.y, sprite.w, sprite.h, item.x, item.y, item.w, item.h) === true) 
					{
							f(item);
					}
				}
			});
			

		};
		
		
		that.Each = function(f){
			
		for (var i = 0; i < that.SpriteArray.length ; i++) { 
			e = that.SpriteArray[i];
			f(e);
		}
			
		};
		
		that.EachWhitIndex = function(f){
			
		for (var i = 0; i < that.SpriteArray.length ; i++) { 
			e = that.SpriteArray[i];
			f(e,i);
		}
			
		};
		
		that.Remove = function(sprite){
		
		for(var i = that.SpriteArray.length - 1; i >= 0; i--) {
			
			if(that.SpriteArray[i] == sprite) {
				that.SpriteArray.splice(i, 1);
			}
		}
		

		};
		
		that.Draw = function(){
			
			that.tree.clear();
			that.tree.insert(that.SpriteArray);

			for (var i = 0; i < that.SpriteArray.length ; i++) { 
				that.SpriteArray[i].Draw();
			}	
			
		};
		
		that.Get = function(index){
			
			return that.SpriteArray[index];
			
		};

		return that;
		
	},
        

    CheckCollision: function (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1) { return true; }
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
	
	
    Kumiho.Camera = { 

		X : 0,
        Y : 0,
        TargetX : 0,
        TargetY : 0,
        Speed : 10,
        MinX : 0,
        MinY : 0,
        
        Fallow: function(sprite){
			
			var currentX = (sprite.x - (Kumiho.Camera.X + (Kumiho.GameObject.Canvas.width / 2))) + Kumiho.Camera.X;
			var currentY = (sprite.y - (Kumiho.Camera.Y + (Kumiho.GameObject.Canvas.height / 2))) + Kumiho.Camera.Y;
			

			if(currentX >= Kumiho.Camera.MinX && currentX <= Kumiho.Camera.MaxW - Kumiho.GameObject.Canvas.width)
			{
				Kumiho.Camera.X = currentX;
			}

			if(currentY >= Kumiho.Camera.MinY && currentY <= Kumiho.Camera.MaxH - Kumiho.GameObject.Canvas.height)
			{
				Kumiho.Camera.Y = currentY;
			}		
			
			
        }
       
	
		
    };
	
	
	
	
	Kumiho.Scene = function(image){
		
		var that = {};
		
		that.Speed = 25;
		that.image = image;

        
        that.Draw = function(){
          
			Kumiho.GameObject.Context.drawImage(
		    that.image,
		    (Kumiho.Camera.X * that.Speed) / 100,
		    (Kumiho.Camera.Y * that.Speed) / 100,
		    Kumiho.GameObject.Canvas.width,
		    Kumiho.GameObject.Canvas.height,
		    0,
		    0,
		    Kumiho.GameObject.Canvas.width,
		    Kumiho.GameObject.Canvas.height);
		  
        };
       
		return that;
       
	
		
    };	
	
	
	
	Kumiho.TileMap = {
		
		Init: function(options) {
			
			Kumiho.TileMap.cols = options.cols;
			Kumiho.TileMap.rows = options.rows;
			Kumiho.TileMap.tsize = options.tsize;
			Kumiho.TileMap.tiles = options.tiles;
            Kumiho.TileMap.image = options.image;
			Kumiho.TileMap.Collction = Kumiho.SpriteCollaction();
			Kumiho.TileMap.sheetcols = options.sheetcols;
			Kumiho.TileMap.sheetrows = options.sheetrows;
			
			
			Kumiho.Camera.MaxW = Kumiho.TileMap.cols * Kumiho.TileMap.tsize;
			Kumiho.Camera.MaxH = Kumiho.TileMap.rows * Kumiho.TileMap.tsize;
			
			for (var c = 0; c < Kumiho.TileMap.cols; c++) {
				for (var r = 0; r < Kumiho.TileMap.rows; r++) {
					var tile = Kumiho.TileMap.GetTile(c, r);
					if (tile !== 0) { 
						
					Kumiho.TileMap.Collction.Add(
					
					
					Kumiho.Sprite({
						
					X:c*Kumiho.TileMap.tsize,
					Y:r*Kumiho.TileMap.tsize,
					Speed:200,
					width:Kumiho.TileMap.tsize,
					height:Kumiho.TileMap.tsize,
					image:Kumiho.TileMap.image ,
					cols:Kumiho.TileMap.sheetcols,
					rows:Kumiho.TileMap.sheetrows,
					tileIndex:tile})

					);
						
					}
				}
			}
			
			
		},
       
		GetTile: function(col, row) {
			return Kumiho.TileMap.tiles[row * Kumiho.TileMap.cols + col];
		},
		
		SetTile: function(col, row, value) {
			Kumiho.TileMap.tiles[row * Kumiho.TileMap.cols + col] = value;
		},
		
		Remove:function(col, row){
			
			Kumiho.TileMap.tiles.SetTile(col, row, 0);
			//Kumiho.TileMap.Collction.Remove();
			
		},
		
		Draw: function(){
			
		
		Kumiho.TileMap.Collction.Draw();
			
			
		}

    };
	
	


//Kumiho Event Listeners


		document.addEventListener("keydown", Kumiho.Controls.keydown); 
		document.addEventListener("keyup", Kumiho.Controls.keyup);


		

/*
 * Javascript Quadtree 
 * @author silflow
 * https://github.com/silflow
 */

var QUAD = {}; // global var for the quadtree

QUAD.init = function (args) {

    var node;
    var TOP_LEFT     = 0;
    var TOP_RIGHT    = 1;
    var BOTTOM_LEFT  = 2;
    var BOTTOM_RIGHT = 3;
    var PARENT       = 4;

    // assign default values
    args.maxChildren = args.maxChildren || 2;
    args.maxDepth = args.maxDepth || 4;

    /**
     * Node creator. You should never create a node manually. the algorithm takes
     * care of that for you.
     */
    node = function (x, y, w, h, depth, maxChildren, maxDepth) {

        var items = [], // holds all items
            nodes = []; // holds all child nodes

        // returns a fresh node object
        return {

            x : x, // top left point
            y : y, // top right point
            w : w, // width
            h : h, // height
            depth : depth, // depth level of the node

            /**
             * iterates all items that match the selector and invokes the supplied callback on them.
             */
            retrieve: function(item, callback, instance) {
                for (var i = 0; i < items.length; ++i) {
                   (instance) ? callback.call(instance, items[i]) : callback(items[i]); 
                }
                // check if node has subnodes
                if (nodes.length) {
                    // call retrieve on all matching subnodes
                    this.findOverlappingNodes(item, function(dir) {
                        nodes[dir].retrieve(item, callback, instance);
                    });
                }
            },

            /**
             * Adds a new Item to the node.
             *
             * If the node already has subnodes, the item gets pushed down one level.
             * If the item does not fit into the subnodes, it gets saved in the
             * "children"-array.
             *
             * If the maxChildren limit is exceeded after inserting the item,
             * the node gets divided and all items inside the "children"-array get
             * pushed down to the new subnodes.
             */
            insert : function (item) {

                var i;

                if (nodes.length) {
                    // get the node in which the item fits best
                    i = this.findInsertNode(item);
                    if (i === PARENT) {
                        // if the item does not fit, push it into the
                        // children array
                        items.push(item);
                    } else {
                        nodes[i].insert(item);
                    }
                } else {
                    items.push(item);
                    //divide the node if maxChildren is exceeded and maxDepth is not reached
                    if (items.length > maxChildren && this.depth < maxDepth) {
                        this.divide();
                    }
                }
            },

            /**
             * Find a node the item should be inserted in.
             */
            findInsertNode : function (item) {
                // left
                if (item.x + item.w < x + (w / 2)) {
                    if (item.y + item.h < y + (h / 2)) {
						return TOP_LEFT;
					}
                    if (item.y >= y + (h / 2)) {
						return BOTTOM_LEFT;
					}
                    return PARENT;
                }

                // right
                if (item.x >= x + (w / 2)) {
                    if (item.y + item.h < y + (h / 2)) {
						return TOP_RIGHT;
					}
                    if (item.y >= y + (h / 2)) {
						return BOTTOM_RIGHT;
					}
                    return PARENT;
                }

                return PARENT;
            },

            /**
             * Finds the regions the item overlaps with. See constants defined
             * above. The callback is called for every region the item overlaps.
             */
            findOverlappingNodes : function (item, callback) {
                // left
                if (item.x < x + (w / 2)) {
                    if (item.y < y + (h / 2)) {
						callback(TOP_LEFT);
					}
                    if (item.y + item.h >= y + h / 2) {
						callback(BOTTOM_LEFT);
					}
                }
                // right
                if (item.x + item.w >= x + (w / 2)) {
                    if (item.y < y + (h / 2)) {
						callback(TOP_RIGHT);
					}
                    if (item.y + item.h >= y + h / 2) {
						callback(BOTTOM_RIGHT);
					}
                }
            },

            /**
             * Divides the current node into four subnodes and adds them
             * to the nodes array of the current node. Then reinserts all
             * children.
             */
            divide : function () {
                var width, height, i, oldChildren;
                var childrenDepth = this.depth + 1;
                // set dimensions of the new nodes
                width = (w / 2);
                height = (h / 2);
                // create top left node
                nodes.push(node(this.x, this.y, width, height, childrenDepth, maxChildren, maxDepth));
                // create top right node
                nodes.push(node(this.x + width, this.y, width, height, childrenDepth, maxChildren, maxDepth));
                // create bottom left node
                nodes.push(node(this.x, this.y + height, width, height, childrenDepth, maxChildren, maxDepth));
                // create bottom right node
                nodes.push(node(this.x + width, this.y + height, width, height, childrenDepth, maxChildren, maxDepth));

                oldChildren = items;
                items = [];
                for (i = 0; i < oldChildren.length; i++) {
                    this.insert(oldChildren[i]);
                }
            },

            /**
             * Clears the node and all its subnodes.
             */
            clear : function () {
				var i;
                for (i = 0; i < nodes.length; i++) {
					nodes[i].clear();
				}
                items.length = 0;
                nodes.length = 0;
            },

            /*
             * convenience method: is not used in the core algorithm.
             * ---------------------------------------------------------
             * returns this nodes subnodes. this is usful if we want to do stuff
             * with the nodes, i.e. accessing the bounds of the nodes to draw them
             * on a canvas for debugging etc...
             */
            getNodes : function () {
                return nodes.length ? nodes : false;
            }
        };
    };

    return {

        root : (function () {
            return node(args.x, args.y, args.w, args.h, 0, args.maxChildren, args.maxDepth);
        }()),

        insert : function (item) {

            var len, i;

            if (item instanceof Array) {
                len = item.length;
                for (i = 0; i < len; i++) {
                    this.root.insert(item[i]);
                }

            } else {
                this.root.insert(item);
            }
        },

        retrieve : function (selector, callback, instance) {
            return this.root.retrieve(selector, callback, instance);
        },

        clear : function () {
            this.root.clear();
        }
    };
};


