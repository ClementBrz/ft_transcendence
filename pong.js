/***********************************************\
 -				GAME_CONFIG						-
\***********************************************/

let	game_done = false;
let	IA_present = false;

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 8;

// Player paddles
const player1 = {
	x: 0,
	y: (canvas.height - paddleHeight) / 2,
	width: paddleWidth,
	height: paddleHeight,
	color: "blue",
	dy: 0,
	score: 0
};

const player2 = {
	x: canvas.width - paddleWidth,
	y: (canvas.height - paddleHeight) / 2,
	width: paddleWidth,
	height: paddleHeight,
	color: "red",
	dy: 0,
	score: 0
};

// Ball properties
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 10,
	speed: 5,
	dx: 5,
	dy: 5
};

// Draw the paddles
function drawPaddle(paddle) {
	ctx.fillStyle = paddle.color;
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw the ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

// Draw the score
function drawScore() {
	ctx.font = "32px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(player1.score, canvas.width / 4, 50);
	ctx.fillText(player2.score, 3 * canvas.width / 4, 50);
}

// Draw the winning message
function drawWinMessage(winner) {
	ctx.font = "48px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(winner + " Wins!", canvas.width / 2 - 100, canvas.height / 2);
}

// Move paddles
function movePaddles() {
	if (player1.dy !== 0) {
		player1.y += player1.dy;
		if (player1.y < 0) {
			player1.y = 0;
		} else if (player1.y + player1.height > canvas.height) {
			player1.y = canvas.height - player1.height;
		}
	}

	if (player2.dy !== 0) {
		player2.y += player2.dy;
		if (player2.y < 0) {
			player2.y = 0;
		} else if (player2.y + player2.height > canvas.height) {
			player2.y = canvas.height - player2.height;
		}
	}
}

// Move the ball
function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;

	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.dy *= -1;
	}

	if (
		(ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height) ||
		(ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height)
	) {
		ball.dx *= -1;
	}

	if (ball.x - ball.radius < 0) {
		player2.score++;
		resetBall();
	} else if (ball.x + ball.radius > canvas.width) {
		player1.score++;
		resetBall();
	}
}

// Reset the ball to the center
function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.dx = -ball.dx;
}

// Check for a winner
function checkWinner() {
	if (player1.score >= 10) {
		return "Player 1";
	} else if (player2.score >= 10) {
		return "Player 2";
	}
	return null;
}

// Game loop
function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle(player1);
	drawPaddle(player2);
	drawBall();
	drawScore();
	movePaddles();
	moveBall();

	const winner = checkWinner();
	if (winner)
		{
			drawWinMessage(winner);
			game_done = true;
		} else {
		requestAnimationFrame(gameLoop);
	}
}

// Event listeners for paddle movement
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
	switch (e.key) {
		case "ArrowUp":
			player2.dy = -paddleSpeed;
			break;
		case "ArrowDown":
			player2.dy = paddleSpeed;
			break;
		case "w":
			player1.dy = -paddleSpeed;
			break;
		case "s":
			player1.dy = paddleSpeed;
			break;
	}
}

function keyUpHandler(e) {
	switch (e.key) {
		case "ArrowUp":
		case "ArrowDown":
			player2.dy = 0;
			break;
		case "w":
		case "s":
			player1.dy = 0;
			break;
	}
}

// Start the game
gameLoop();
