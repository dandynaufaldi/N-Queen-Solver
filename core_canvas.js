/*Object mycanvas
Attr:
- canvas chess
- ‎canvas line graph

Method :
- start
- ‎reset

Object : chessboard
Attr :
- 1D arr queen 
- ‎Mode
- ‎Algorithm option
- ‎2D arr chess board (heuristic value in canvas)
- ‎curr queen
- ‎curr row
- ‎step counter
- ‎arr heuristic history

Method
- check col
- ‎check row
- ‎check diaPos
- ‎check diaNeg
- ‎getHeuristic
- ‎makemove
- ‎run (move count, makemove, getheur, show heur 1 queen, select n mark min, from all choose best, update queen pos) based on algo
- ‎draw line graph*/

$(document).ready(function(){
	var chessCanvas = document.getElementById("chess-canvas");
	var lineCanvas = document.getElementById("line-canvas");

	function Petak(x, y, type){
		this.x = x;
		this.y = y;
		this.type = type;
		this.heurVal = undefined;
		
		this.draw = function(c){
			
		}
	}
});