# Kumiho
Time base Javascript Canvas 2D game lib


## Kullanımı 


```javascript
c=document.getElementById("myCanvas");
 ctx=c.getContext("2d");   

    
var myGame = {
	Canvas:c,
	Context:ctx,

	Init: function()
	{
		//your code run once
	},

	Update: function()
	{
        	//your game logic, core macanics
        
	},
	
	Draw: function()
	{      
		// rendering the objects
        
	}
};

Kumiho.Run(myGame);
```

## Animasyon Oluşturma

```javascript

var AnAnimation = Kumiho.Animate({
	width: 61,
	height: 61,
	image: runImage,
	numberOfFrames: 8,
	ticksPerSec: 9,
	Loop:true, 
	Index: 0
});

```
