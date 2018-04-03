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
	var lineGraph = document.getElementById("line-canvas");

	function Petak(elem, type){
		this.elem = elem; //getElementById per button
		this.type = type; //queen or not
		this.heurVal = -1; //default value
		
		this.draw = function(){
			if (type == "queen"){
				this.elem.style.background-image = url("queen.png");
				this.elem.innerHTML="";
			}
			else {
				this.elem.style.background-image = "";
				this.elem.innerHTML= this.heurVal;
			}
		}
	}

	var chessBoard = {
		mode : document.getElementById("input-select").value,
		size : parseInt(document.getElementById("input-n").value),
		queenArr : [],
		boardArr : [],
		initBoard : function(){ //asumsi mode random, belum ada terima inputan posisi queen
			
		}
	}
});