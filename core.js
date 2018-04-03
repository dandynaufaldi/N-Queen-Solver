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

$(document).ready( function(){
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
		stepCount : 1,
		queenArr : [],
		boardArr : [],
		rawBoardArr : [],
		heurHist : [],
		currQueen : -1,
		currRow : -1,
		initBoard : function(){ //asumsi mode random, belum ada terima inputan posisi queen
			//init queen position for each column
			for (var i = 0; i < this.size; i++) {
				let col = Math.floor(Math.random() * this.size);
				queenArr.push(col);
				console.log('Place Queen at row '+i+' col '+col);
			}

			//init rawBoardArr
			for (var i = 0; i < this.size; i++) {
				this.rawBoardArr.push([]);
				for(var j = 0; j < this.size; j++){
					if (this.queenArr[j]==i) this.rawBoardArr[i].push(-2);
					else this.rawBoardArr[i].push(-1);
				}
			}

			//load button to arr
			for (var i = 0; i < this.size; i++) {
				boardArr.push([]);
				for (var j = 0; j < this.size; j++){
					let tempID = i.toString() + j.toString();
					let temp = document.getElementById(tempID);
					let obj = undefined;
					if (queenArr[j] == i) obj = new Petak(temp, "queen");
					else obj = new Petak(temp, "empty");
					boardArr[i].push(obj);
				}
			}
		},
		syncBoard : function(){
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if (this.rawBoardArr[i][j] == -2)
						this.boardArr[i][j].type = "queen";
					else this.boardArr[i][j].type = "empty";
					this.boardArr[i][j].heurVal = -1;
					if (this.rawBoardArr[i][j] >= -1)
						this.boardArr[i][j].heurVal = this.rawBoardArr[i][j];
				}
			}
		},
		resetRawBoard : function(){
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if (this.queenArr[j] = i)
						this.rawBoardArr[i][j] = -2;
					else this.rawBoardArr[i][j] = -1;

				}
			}
		}
		checkRow : function(pos_c){
			let res = 0;
			for (var i = 0; i < this.size; i++){
				if (i == pos_c) continue;
				if (this.queenArr[pos_c] == this.queenArr[i])
					res++;
			}
			return res;
		},
		checkDia : function(pos_c){
			let res = 0;
			for(var i = 0; i < this.size; i++){
				if (i == pos_c) continue;
				let offset = pos_c - i;
				if (this.queenArr[pos_c] == this.queenArr[i] - offset || 
					this.queenArr[pos_c] == this.queenArr[i] + offset)
					res++;
			}
			return res;
		},
		getHeuristic : function(cek_board){
			let res = 0;
			for (var i = 0; i < this.size; i++) {
				res += this.checkRow(i);
				res += this.checkDia(i);
			}
			res = Math.floor(res/2);
			return res;
		},
		makeMove : function(old_c, old_r, new_r){
			var temp_board = this.rawBoardArr.slice();
			
		}
	}
});