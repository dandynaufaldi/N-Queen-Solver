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
	// var lineGraph = document.getElementById("line-canvas");

	function Petak(elem, type){
		this.elem = elem; //getElementById per button
		this.type = type; //queen or not
		if (type == "queen")
			this.heurVal = -2; //default queen value
		else this.heurVal = -1;
		
		this.draw = function(){
			if (this.heurVal == -2){
				this.elem.style.backgroundImage = "url('kuin.png')";
				this.elem.innerHTML=".";
			}
			else {
				this.elem.style.backgroundImage = "none";
				if (this.heurVal > -1)
					this.elem.innerHTML= this.heurVal.toString();
				else this.elem.innerHTML=".";
			}
		}
	}

	var chessBoard = {
		mode : undefined,
		size : undefined,
		stepCount : 1,
		queenArr : undefined,	//posisi queen, 1-D arr
		boardArr : undefined,	//element button
		rawBoardArr : undefined,	//arr angka simpan heuristic value 1 board
		heurHist : undefined,	//rekap heuristic untuk diplot
		currQueen : -1,
		heurToBeat : 1000000,
		keepRun : false,
		initBoard : function(){ //asumsi mode random, belum ada terima inputan posisi queen
			this.mode = document.getElementById("input-select").value;
			this.size = parseInt(document.getElementById("input-n").value);
			//init queen position for each column
			this.queenArr = [];
			for (var i = 0; i < this.size; i++) {
				let row = Math.floor(Math.random() * this.size);
				this.queenArr.push(row);
				console.log('Place Queen at col '+i+' row '+row);
			}

			//init rawBoardArr
			this.rawBoardArr = [];
			for (var i = 0; i < this.size; i++) {
				this.rawBoardArr.push([]);
				for(var j = 0; j < this.size; j++){
					if (this.queenArr[j]==i) this.rawBoardArr[i].push(-2);
					else this.rawBoardArr[i].push(-1);
				}
			}

			//load button to arr
			this.boardArr = [];
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

			this.heurHist = [];
			this.currQueen = -1;
			this.heurToBeat = 1000000;
			this.keepRun = true;
			this.drawBoard();
		},
		syncBoard : function(){
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if (this.queenArr[j] == i){
						this.boardArr[i][j].type = "queen";
						this.boardArr[i][j].heurVal = -2;
					}
					else{
						this.boardArr[i][j].type = "empty";
						if (this.boardArr[i][j].heurVal == -2)
							this.boardArr[i][j].heurVal = -1;
					}
				}
			}
		},
		resetRawBoard : function(){	//set rawboard -2 queen , -1 empty
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
			if (this.heurToBeat > 0){
				console.log('run step');
				if (this.currQueen == this.size){
					this.evaluate();
					this.drawBoard();
					this.resetRawBoard();
				}
				else{
					var found = false;
					if (this.currQueen == -1 )
						this.currQueen = 0;
					let step =  this.currQueen + num_step;
					for (var i = this.currQueen; i < step && !found && i < this.size; i++) {
						this.currQueen = i;
						let cur_row = this.queenArr[i];
						for (var j = 0; j < this.size && !found; j++){
							if (j == cur_row) continue;
							var new_board = this.makeMove(i, j);
							let heur_score = this.getHeuristic(new_board);
							this.rawBoardArr[j][i] = heur_score;
							this.boardArr[j][i].heurVal = heur_score;
							console.log('col '+i+' row '+j+' heur '+this.boardArr[j][i].heurVal);
						}
					}
					this.currQueen++;
					if (this.currQueen == this.size){
						this.evaluate();
						this.drawBoard();
						this.resetRawBoard();
						this.syncBoard();
					}
				}
			}
		},
		evaluate : function(){
			this.stepCount++;
			if (this.stepCount % 1000 == 0){
				var x = confirm("Banyak step sudah mencapai "+this.stepCount+" .Tetap lanjut?");
				if (x == false) return;
			}
			setTimeout(this.drawBoard(), 5000);
			console.log(this.queenArr);
			console.log(this.heurToBeat);
			console.log(this.rawBoardArr);
			let minRow = -1;
			let minCol = -1;
			let minHeur = 1000000;
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if (this.queenArr[j] != i && this.rawBoardArr[i][j] < minHeur){
						minRow = i;
						minCol = j;
						minHeur = this.rawBoardArr[i][j];
					}
				}
			}
			if (minHeur == this.heurToBeat){
				alert('Restarting');
				this.initBoard();
				appendlog(">Random Restart karena nilai heuristik sekarang tidak lebih kecil daripada herustik sebelumnya");
			}
			else{
				resetwarna();
				var x = this.queenArr[minCol];
				var id = x.toString() + minCol.toString();
				$("#"+id).css("background-color","yellow");
				this.queenArr[minCol] = minRow;
				this.heurToBeat = minHeur;
				console.log('Move queen '+minCol+' heur '+minHeur);
				appendlog(">Pindah queen pada kolom: " +minCol +" dari row : "+x+" ke "+minRow);
				this.resetRawBoard();
				this.currQueen = -1;
				x = this.queenArr[minCol];
				id = x.toString() + minCol.toString();
				$("#"+id).css("background-color","green");
				if (minHeur == 0){
					alert('FINISH GAN');
					appendlog("<h3>Finish dengan "+this.stepCount+" step</h3>")
				}
			}
		},
		runLoop : function(){
			console.log('runLoop');
			while(this.heurToBeat > 0 && this.keepRun){
				this.run(this.size);
			}
		},
		drawBoard : function(){
			console.log('Draw');
			this.syncBoard();
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					this.boardArr[i][j].draw();
				}
			}
		}
	}


$('#form-container').submit(function() {
	$(this).css("display","none");
	getinput(0);
	chessBoard.initBoard();
	// alert('SUBMIT');
	return false;	
});

function getmyidname(mine){
	alert($(mine).attr('id'));

}

function getinput(flag){
	var n;
	var option;
	n=document.getElementById("input-n").value;
	n=parseInt(n);

	//$("#button-container").children("button").remove();
	if (flag==0){
		var flag1=0;
		for (var i = 0; i < n; i++) {
			if (i%2==0) flag1=0;
			else flag1=1;
			for (var j =0 ; j< n ; ++j){
				var id="'"+i+j+"'";
				var button="<button class='main-object' id="+id+" onclick='getmyidname(this)'></button>";
				$("#button-container").append(button);
				id=i.toString() + j.toString();
				id=id.toString();
				if (flag1%2==0){
					$("#"+id).css("background-color","#ffef96");
				}
				else{
					$("#"+id).css("background-color","#bc5a45");
				}
				++flag1;

			}
		}
	}
	var raw_height=($(window).height());
	var raw_width=($(window).width());
	var win_height=raw_height-20;
	var win_width=raw_width-20;
	var win_margin=0;
	var flag=1;


	$(".btn-on-heu").css("margin-top","0");
	if (win_height>=win_width){
		//kalau H>W
		win_margin=100*((win_height-win_width)/2)/raw_width;
		win_height=win_width;
		if ((win_width/win_height)>=0.5){
			win_margin=100*((raw_width-win_width)/2)/raw_width;
			$(".btn-on-heu-1").css("margin-top","3%");
		}
	}
	else{
		win_margin=100*((win_width-win_height)/2/raw_width);
		flag=0;
	}
	var obj_size=win_height/n;
	obj_size=(obj_size/win_height)*100;
	
	if(flag==1){
		win_height=(win_width/raw_height)*100;
		win_width=(win_width/raw_width)*100;
	}
	else{
		win_width=(win_height/raw_width)*100;
		win_height=(win_height/raw_height)*100;
	}

	win_width=win_width+"%";
	win_height=win_height+"vh";
	win_margin=win_margin+"%";

	obj_size=obj_size+"%";

	$("#button-container").css("width",win_width);
	$("#button-container").css("height",win_height);
	$("#button-container").css("margin-left","1%");
	$("#btn-log-container").css("width",win_width);
	$("#btn-log-container").css("height",win_height);
	$("#btn-log-container").css("margin-left","1%");
	$("#btn-log-container").css("display","block");
	$(".main-object").css("width",obj_size);
	$(".main-object").css("height",obj_size);
}

function resetwarna(){
		var n=chessBoard.size;
		var flag1=0;
		for (var i = 0; i < n; i++) {
			if (i%2==0) flag1=0;
			else flag1=1;
			for (var j =0 ; j< n ; ++j){
				var id=i.toString() + j.toString();
				id=id.toString();
				if (flag1%2==0){
					$("#"+id).css("background-color","#ffef96");
				}
				else{
					$("#"+id).css("background-color","#bc5a45");
				}
				++flag1;

			}
		}
}

$( "#stop-btn" ).bind( "click", function() {
	// alert('STOP');
	chessBoard.keepRun = false;
});

$( "#fastforward-btn" ).bind( "click", function() {
	// alert('runloop');
 	chessBoard.runLoop();
});
// $( "#kolom-btn" ).bind( "click", function() {
// 	// alert('runstep');
// 	resetwarna();
// 	chessBoard.run(1);
// }); 
	
$( "#semua-btn" ).bind( "click", function() {
	// alert('runboard');
	
	chessBoard.run(chessBoard.size);
});

$( "#unlock-btn" ).bind( "click", function() {
	// alert('unlock');
	chessBoard.keepRun = false;
});

window.onresize = function(event) {
	getinput(1);
	chessBoard.drawBoard();
};

function appendlog(str){ //edit parameter sesuai kebutuhan mu boy
	var p = "<p>"+str+"</p>";
	var temp= $("#log-container").html();
	$("#log-container").children("p").remove();
	$("#log-container").append(p);
	$("#log-container").append(temp);
}