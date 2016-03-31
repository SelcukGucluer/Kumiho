# Kumiho
Javascript Canvas 2D game lib

# kullanımı 

c=document.getElementById("myCanvas");
 ctx=c.getContext("2d");   

    
var myGame = {

	Canvas:c,
	Context:ctx,

	Init: function()
	{
    a =  Kumiho.Sprite({Speed:Kumiho.Random(100,1),width:100,height:45,X:Kumiho.Random(500,1),Y:Kumiho.Random(500,1)});
		
		skor = Kumiho.Text({message:"selam millet",X:30,Y:30,font:"50px Arial"});
    

	},

	Update: function()
	{
        
      if(Kumiho.CheckCollisionInCollaction(mycollaction.sprites[6],mycollaction.sprites))
          {
              mycollaction.sprites[6].color = "#7099F0"
          }
        
        
	},
	
	Draw: function()
	{      
        a.Draw();

        skor.Draw();
        
	}
    
    
	
};

Kumiho.Run(myGame);

