const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cols = 21;
const rows = 21;
const cubeSize = canvas.width / cols;
const color1 = "green";
const color2 = "lime";
const snakeSpeed = 500;
let go = null;
let num = Number(score.innerHTML);
const arr = [[0,0],[0,1]];
const matrix = createMatrix(cols,rows);
let food = [Math.floor(Math.random()*cols),Math.floor(Math.random()*rows)];
drawArea();
drawSnake();
function createMatrix(cols,rows){
	const result = [];
	for(let y = 0; y < rows; y++){
		const row = [];
		for(let x = 0; x < cols; x++){
			row[x] = null;
		}
		result.push(row);
	}
	return result;
}
function drawArea(){
	let turn = true;
	for(let y = 0; y < rows; y++){
		for(let x = 0; x < cols; x++){
			const color = turn ? color1 : color2;
			turn=!turn;
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.fillRect(x*cubeSize,y*cubeSize,cubeSize,cubeSize);
		}
	}
}

function drawFood(eaten = false){
	drawArea();
	let col,row;
	if(eaten){
		num++;
		score.innerHTML = num;

		col = Math.floor(Math.random()*cols);
		row = Math.floor(Math.random()*rows);
		food = [];
		food.push(row,col);
		const lastItem = arr[arr.length-1];
		switch(go){
			case "top":
				arr.push([lastItem[0]-1,lastItem[1]]);
			break;
			case "bottom":
				arr.push([lastItem[0]+1,lastItem[1]]);
			break;
			case "right":
				arr.push([lastItem[0],lastItem[1]+1]);
			break;
			case "left":
				arr.push([lastItem[0],lastItem[1]-1]);
			break;
		}
	}else{
		row = food[0];
		col = food[1];
	}
	matrix[row][col] = false;
	ctx.save()
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.fillRect(col*cubeSize,row*cubeSize,cubeSize,cubeSize);
}
function drawSnake(){
	const gameOver = snakeMove();
	if(gameOver == false){
		return false;
	}
	drawFood();
    arr.forEach(e => {
		if(arr.indexOf(e) != arr.length-1){
			ctx.beginPath()
			ctx.fillStyle = "black";
			ctx.fillRect(e[1]*cubeSize,e[0]*cubeSize,cubeSize,cubeSize);
		}else{
			ctx.beginPath()
			ctx.arc(e[1]*cubeSize+cubeSize/2,e[0]*cubeSize+cubeSize/2,cubeSize/2,0,2*Math.PI);
			ctx.fillStyle = "blue"
			ctx.fill()
		}
	})
}
function snakeMove(){
	let newArray = [];
	Object.assign(newArray,arr);
	newArray = newArray.reverse();
	if(
		newArray[0][0] >= rows ||
		newArray[0][0] < 0 ||
		newArray[0][1] >= cols ||
		newArray[0][1] < 0
	){
		gameOver();
		return false;
	}
	if(matrix[newArray[0][0]][newArray[0][1]] == false){
		drawFood(true)
	}
	arr.forEach(e => {
		matrix[e[0]][e[1]] = true;
	});
}
let intervals = {
	top: null,
	bottom: null,
	right: null,
	left: null
}
const bottom = function(){
	if(go != "top" && go != "bottom"){
		go = "bottom"
		for(let i in intervals){
			if(intervals[i] != null){
				clearInterval(intervals[i]);
			}
		}
		const move = () => {
			const last = arr[arr.length-1];
			arr.shift();
			arr.push([last[0]+1,last[1]]);
			drawSnake();
		}
		move()
		intervals.bottom = setInterval(move,snakeSpeed)
	}
	
}
const topGo = function(){
	if(go != "top" && go != "bottom"){
		go = "top";
		for(let i in intervals){
			if(intervals[i] != null){
				clearInterval(intervals[i]);
			}
		}
		const move = () => {
			const last = arr[arr.length-1];
			arr.shift();
			arr.push([last[0]-1,last[1]]);
			drawSnake();
		}
		move();
		intervals.bottom = setInterval(move,snakeSpeed)
	}
}
const right = function(){
	if(go != "left" && go != "right"){
		go = "right";
		for(let i in intervals){
		if(intervals[i] != null){
			clearInterval(intervals[i]);
		}
	}
	const move = () => {
		const last = arr[arr.length-1];
		arr.shift();
		arr.push([last[0],last[1]+1]);
		drawSnake();
	};
	move();
	intervals.right = setInterval(move,snakeSpeed)
	}
}
const left = function(){
	if(go != "left" && go != "right"){
		go = "left";
		for(let i in intervals){
		if(intervals[i] != null){
			clearInterval(intervals[i]);
		}
	}
	const move = () => {
		const last = arr[arr.length-1];
		arr.shift();
		arr.push([last[0],last[1]-1]);
		drawSnake();
	}
	move();
	intervals.left = setInterval(move,snakeSpeed)
	}
}
document.onkeydown = e => {
	switch(e.keyCode){
		case 40:
			bottom();
		break;
		case 38:
			topGo();
		break;
		case 39:
			right();
		break;
		case 37:
			left();
		break;
	}
};

function gameOver(){
	for(let i in intervals){
		if(intervals[i] != null){
			clearInterval(intervals[i]);
		}
	}
	finalScore.innerHTML += num;
	document.querySelector("#gameOver").setAttribute("class","active");
}