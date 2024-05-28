//add this file under the script section in index.html from 1.0-Game_2d
	//<script src="../AI_algorithm.js"></script>

// const START_RIGHT_PADDLE_Y	= (FIELD_HEIGHT - PADDLE_HEIGHT) / 2;
// const START_RIGHT_PADDLE_X	= FIELD_WIDTH - PADDLE_WIDTH;

// let paddle = 
// {
// 	x : START_RIGHT_PADDLE_X, //osef non?
// 	y : START_RIGHT_PADDLE_Y
// };

// let ball = 
// {
// 	x, //osef non?
// 	y
// };

// let paddle_Y = START_RIGHT_PADDLE_Y;
let ball_Y;

// function move()
// {
// 	if (ball_Y > paddle_Y)
// 		paddle_Y--;
// 	else if (ball_Y < paddle_Y)
// 		paddle_Y++;
// }

function simulateKeyPress(key) {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
}

function simulateKeyRelease(key) {
	document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
}

function move() {
	if (ball_Y < rigthPaddleY)
	{
		simulateKeyPress('ArrowUp');
		simulateKeyRelease('ArrowDown');
	}
	else if (ball_Y > rigthPaddleY)
	{
		simulateKeyPress('ArrowDown');
		simulateKeyRelease('ArrowUp');
	}
}

// function updateBallPos()
// {
// 	// ball_Y = getBallPos(); //getBallPos : fonction in game.js
// 	ball_Y = ballY; //ballY in game.js
// 	console.log("ball pos Y : ", ball_Y);
// }

function AI_loop()
{
	move();
	// drawPaddle(rightPaddleX, paddle_Y, rightPaddleColor);
	//drawPaddle(rightPaddleX, rigthPaddleY, rightPaddleColor);
	//requestAnimationFrame(AI_loop); //fonction in game.js. Verifier ce qui se passe si game.js et ici font la demande en meme temps
}

console.log("I AM INSIDE THE AI ALGORITHM!");
//updates ball pos only once per sec
// setInterval(updateBallPos, 1000);
ball_Y = ballY; //TEST
AI_loop();
