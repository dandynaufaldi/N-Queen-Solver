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

// $(document).ready( function(){
	var lineGraph = document.getElementById("line-canvas");

	function Petak(elem, type){
		this.elem = elem; //getElementById per button
		this.type = type; //queen or not
		this.heurVal = -1; //default value
		
		this.draw = function(){
			if (type == "queen"){
				// this.elem.style.backgroundImage = "url('queen.png')";
				this.elem.innerHTML=" ";
			}
			else {
				// this.elem.style.backgroundImage = "";
				this.elem.innerHTML= this.heurVal.toString();
			}
		}
	}

	var chessBoard = {
		mode : undefined,
		size : undefined,
		stepCount : 1,
		queenArr : [],	//posisi queen, 1-D arr
		boardArr : [],	//element button
		rawBoardArr : [],	//arr angka simpan heuristic value 1 board
		heurHist : [],	//rekap heuristic untuk diplot
		currQueen : -1,
		heurToBeat : 1000000,
		initBoard : function(){ //asumsi mode random, belum ada terima inputan posisi queen
			this.mode = document.getElementById("input-select").value;
			this.size = parseInt(document.getElementById("input-n").value);
			//init queen position for each column
			for (var i = 0; i < this.size; i++) {
				let row = Math.floor(Math.random() * this.size);
				this.queenArr.push(row);
				console.log('Place Queen at col '+i+' row '+row);
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
				this.boardArr.push([]);
				for (var j = 0; j < this.size; j++){
					let tempID = i.toString() + j.toString();
					let temp = document.getElementById(tempID);
					let obj = undefined;
					if (this.queenArr[j] == i) 
						obj = new Petak(temp, "queen");
					else 
						obj = new Petak(temp, "empty");
					this.boardArr[i].push(obj);
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
					if (this.queenArr[j] == i)
						this.rawBoardArr[i][j] = -2;
					else this.rawBoardArr[i][j] = -1;

				}
			}
		},
		checkRow : function(temp_queen, pos_c){
			let res = 0;
			for (var i = 0; i < this.size; i++){
				if (i == pos_c) continue;
				if (temp_queen[pos_c] == temp_queen[i])
					res++;
			}
			return res;
		},
		checkDia : function(temp_queen, pos_c){
			let res = 0;
			for(var i = 0; i < this.size; i++){
				if (i == pos_c) continue;
				let offset = pos_c - i;
				if (temp_queen[pos_c] == temp_queen[i] - offset || 
					temp_queen[pos_c] == temp_queen[i] + offset)
					res++;
			}
			return res;
		},
		getHeuristic : function(temp_queen){
			let res = 0;
			for (var i = 0; i < this.size; i++) {
				res += this.checkRow(temp_queen, i);
				res += this.checkDia(temp_queen, i);
			}
			res = Math.floor(res/2);
			return res;
		},
		makeMove : function(old_c, new_r){
			var temp_board = this.queenArr.slice();
			temp_board[old_c] = new_r;
			return temp_board;
		},
		run : function(num_step){
			// if (this.currQueen == this.size){
			// 	this.evaluate();
			// 	this.resetRawBoard();
			// 	this.syncBoard();
			// }
			// else{
				var found = false;
				if (this.currQueen == -1 )
					this.currQueen = 0;
				let step =  this.currQueen + num_step;
				for (var i = this.currQueen; i < step && !found; i++) {
					// console.log('Check on col '+i);
					this.currQueen = i;
					let cur_row = this.queenArr[i];
					for (var j = 0; j < this.size && !found; j++){
						if (j == cur_row) continue;
						// console.log('Run row '+j);
						var new_board = this.makeMove(i, j);
						let heur_score = this.getHeuristic(new_board);
						this.rawBoardArr[j][i] = heur_score;
						if (heur_score >=0 &&  heur_score < this.heurToBeat){
							console.log(this.rawBoardArr);
							this.queenArr[i] = j;
							this.resetRawBoard();
							this.syncBoard();
							this.currQueen = -1;
							found = true;
							this.heurToBeat = heur_score;
						}
					}
				}
				// this.currQueen++;
				// if (this.currQueen == this.size){
				// 	this.evaluate();
				// 	this.resetRawBoard();
				// 	this.syncBoard();
				// }
				if (!found){
					let col_r = Math.floor(Math.random() * this.size);
					let row_r = Math.floor(Math.random() * this.size);
					this.heurToBeat = this.getHeuristic(this.makeMove(col_r, row_r));
					this.queenArr[col_r] = row_r;
					console.log('Random move');
				}
				this.resetRawBoard();
				this.syncBoard();
				this.currQueen = -1;
				console.log(this.heurToBeat);
				// console.log(this.rawBoardArr);
				console.log(this.queenArr);
				this.heurHist.push(this.heurToBeat);
			// }
		},
		evaluate : function(){
			// let minRow = -1;
			// let minCol = -1;
			// let minHeur = 1000000;
			// for (var i = 0; i < this.size; i++) {
			// 	for (var j = 0; j < this.size; j++) {
			// 		if (this.queenArr[j] != i && this.rawBoardArr[i][j] < minHeur){
			// 			minRow = i;
			// 			minCol = j;
			// 			minHeur = this.rawBoardArr[i][j];
			// 		}
			// 	}
			// }
			// this.queenArr[minCol] = minRow;
			// console.log('Move queen '+minCol+' heur '+minHeur);
			this.resetRawBoard();
			this.syncBoard();
			this.currQueen = -1;
			if (minHeur == 0)
				alert('FINISH GAN');
		}

	}
// });