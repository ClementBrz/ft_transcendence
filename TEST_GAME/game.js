/********************** Récuperer les canvas **********************/

	// Canvas du score
	const scoreCanvas = document.getElementById("scoreCanvas");
	const scoreCtx = scoreCanvas.getContext("2d");

	// Canvas du gagnant
	const winnerCanvas = document.getElementById("winnerCanvas");
	const winnerCtx = winnerCanvas.getContext("2d");

	// Canvas de la manche
	const roundCanvas = document.getElementById("roundCanvas");
	const roundCtx = roundCanvas.getContext("2d");

	// Canvas du terrain de jeu
	const gameCanvas = document.getElementById("gameCanvas");
	const gameCtx = gameCanvas.getContext("2d");

/********************** Définir les constantes **********************/

	// Pour les keys
	const SPACE = ' ';

	// Pour les couleurs
	const WHITE		= "#ffffff";
	const BLACK		= "#000000";
	const GREY		= "#d8c9c9";
	const RED		= "#ff0000";
	const GREEN		= "#00ff00";
	const BLUE		= "#0000ff";
	const CYAN		= "#00ffff";
	const MAGENTA	= "#ff00ff";
	const YELLOW	= "#ffff00";
	const ORANGE	= "#ffa500";
	const PURPLE	= "#800080";
	
	// Pour le terrain
	const FIELD_WIDTH	= gameCanvas.width;
	const FIELD_HEIGHT	= gameCanvas.height;
	const FIELD_START_X = 0;
	const FIELD_END_X = FIELD_WIDTH;
	const FIELD_HALF_X = FIELD_WIDTH / 2;
	const FIELD_START_Y = 0;
	const FIELD_END_Y = FIELD_HEIGHT;
	const FIELD_HALF_Y = FIELD_HEIGHT / 2;
	const LIMIT_NET = FIELD_WIDTH / 10;

	// Pour les paddles
	const PADDLE_WIDTH			= 50;
	const PADDLE_HEIGHT			= 100;
	const PADDLE_SPEED			= 4;
	const INITIAL_PADDLE_COLOR	= GREY;
	const LEFT_PADDLE_COLOR		= CYAN;
	const RIGHT_PADDLE_COLOR	= YELLOW;

	const START_LEFT_PADDLE_Y	= (FIELD_HEIGHT - PADDLE_HEIGHT) / 2;
	const START_LEFT_PADDLE_X	= FIELD_START_X;
	const START_RIGHT_PADDLE_Y	= (FIELD_HEIGHT - PADDLE_HEIGHT) / 2;
	const START_RIGHT_PADDLE_X	= FIELD_WIDTH - PADDLE_WIDTH;

	// Pour la balle
	const BALL_RADIUS			= 10;
	const BALL_SPEED_X			= 3;
	const BALL_SPEED_Y			= 3;
	const INITIAL_BALL_COLOR	= WHITE;

	// Pour les round
	const ROUND_WIDTH	= roundCanvas.width;
	const ROUND_HEIGHT	= roundCanvas.height;
	
	// Pour les scores
	const SCORE_WIDTH	= scoreCanvas.width;
	const SCORE_HEIGHT	= scoreCanvas.height;

	// Pour le gagnant
	const WINNER_WIDTH	= winnerCanvas.width;
	const WINNER_HEIGHT	= winnerCanvas.height;

/********************** Définir les variables **********************/

	// Pour les couleurs

	// Pour lancer le jeu
	let gameStarted	= false;
	let launchSide	= 1;

	// Pour les paddles
	let leftPaddleColor		= INITIAL_PADDLE_COLOR;
	let rightPaddleColor	= INITIAL_PADDLE_COLOR;
	let leftPaddleX			= START_LEFT_PADDLE_X;
	let leftPaddleY			= START_LEFT_PADDLE_Y;
	let rightPaddleX		= START_RIGHT_PADDLE_X;
	let rightPaddleY		= START_RIGHT_PADDLE_Y;
	
	// Pour la balle
	let ballColor			= INITIAL_BALL_COLOR;
	let ballX				= FIELD_WIDTH / 2;
	let ballY				= FIELD_HEIGHT / 2;
	let ballSpeedX			= 0;
	let ballSpeedY			= 0;
	let ballLeftSideX		= 0;
	let ballLeftSideY		= 0;
	let ballRightSideX		= 0;
	let ballRightSideY		= 0;
	let ballUpSideX			= 0;
	let ballUpSideY			= 0;
	let ballDownSideX		= 0;
	let ballDownSideY		= 0;

	// Pour les collisions raquettes balle
	let ballOnLeftPaddleSideRight	= false;
	let ballOnLeftPaddleSideLeft	= false;

	// Pour les scores
	let scoreLeft			= 0;
	let scoreRight			= 0;
	let newScore			= true;
	scoreCtx.font			= '30px Arial'; // Taille et police du texte
	scoreCtx.fillStyle		= 'red'; // Couleur du texte
	scoreCtx.textAlign		= 'center'; // Alignement du texte
	scoreCtx.textBaseline	= 'middle'; // Position verticale du texte

	// Pour les manches
	let round				= 1;
	let newRound			= true;
	roundCtx.font			= '30px Arial'; // Taille et police du texte
	roundCtx.fillStyle		= 'green'; // Couleur du texte
	roundCtx.textAlign		= 'center'; // Alignement du texte
	roundCtx.textBaseline	= 'middle'; // Position verticale du texte

	// Pour le gagnant
	winnerCtx.font			= '30px Arial'; // Taille et police du texte
	winnerCtx.fillStyle		= 'yellow'; // Couleur du texte
	winnerCtx.textAlign		= 'center'; // Alignement du texte
	winnerCtx.textBaseline	= 'middle'; // Position verticale du texte

	// Pour les keys
	let keysPressed	= {};

/********************** Gestionnaires d'événement **********************/

	// Pour détecter l'appui sur une touche
	document.addEventListener("keydown", function(event) {
		keysPressed[event.key] = true;
	});

	// Pour détecter le relâchement d'une touche
	document.addEventListener("keyup", function(event) {
		delete keysPressed[event.key];
	});

/********************** Fonctions pour afficher les infos **********************/

	// Pour afficher le score
	function displayScore()
	{
		console.log("On affiche le score!");
		scoreCtx.clearRect(0, 0, SCORE_WIDTH, SCORE_HEIGHT);
		scoreCtx.fillText(scoreLeft, 10, scoreCanvas.height / 2);
		scoreCtx.fillText(scoreRight, scoreCanvas.width - 20, scoreCanvas.height / 2);
		newScore = false;
		newRound = false;
	}

	// Pour afficher le gagnant
	function displayRound()
	{
		console.log("On affiche le round!");
		roundCtx.clearRect(0, 0, ROUND_WIDTH, ROUND_HEIGHT);
		roundCtx.fillText("ROUND " + round, roundCanvas.width / 2, roundCanvas.height / 2);
	}

	// Pour afficher le gagnant
	function displayWinner()
	{
		console.log("On affiche le gagnant!");
		winnerCtx.clearRect(0, 0, WINNER_WIDTH, WINNER_HEIGHT);
		let winner = "";
		if (scoreLeft == 10)
			winner = "Left";
		else
		winner = "Right";
		winnerCtx.fillText(winner + " won !", winnerCanvas.width / 2, winnerCanvas.height / 2);
	}

	// Pour écouter les keys
	function keyHook()
	{
		// Déplacer la raquette gauche
		if (keysPressed["w"]) {
			leftPaddleY -= PADDLE_SPEED;
		}
		if (keysPressed["s"]) {
			leftPaddleY += PADDLE_SPEED;
		}
		if (keysPressed["a"]) {
			leftPaddleX -= PADDLE_SPEED;
		}
		if (keysPressed["d"]) {
			leftPaddleX += PADDLE_SPEED;
		}

		// Déplacer la raquette droite
		if (keysPressed["ArrowUp"]) {
			rightPaddleY -= PADDLE_SPEED;
		}
		if (keysPressed["ArrowDown"]) {
			rightPaddleY += PADDLE_SPEED;
		}
		if (keysPressed["ArrowLeft"]) {
			rightPaddleX -= PADDLE_SPEED;
		}
		if (keysPressed["ArrowRight"]) {
			rightPaddleX += PADDLE_SPEED;
		}
	}

	// Limiter les position X et Y des raquettes pour qu'elles reste dans les limites du terrain
	function checkPaddleLimits()
	{
		// Limiter la position de la raquette left
		leftPaddleX = Math.min(Math.max(leftPaddleX, FIELD_START_X), FIELD_HALF_X - PADDLE_WIDTH - LIMIT_NET);
		leftPaddleY = Math.min(Math.max(leftPaddleY, FIELD_START_Y), FIELD_HEIGHT - PADDLE_HEIGHT);
		
		// Limiter la position Y
		rightPaddleX = Math.min(Math.max(rightPaddleX, FIELD_HALF_X + LIMIT_NET), FIELD_WIDTH - PADDLE_WIDTH);
		rightPaddleY = Math.min(Math.max(rightPaddleY, FIELD_START_Y), FIELD_HEIGHT - PADDLE_HEIGHT);
	}

	// Mettre à jour la position de la balle
	function updateBall()
	{
		ballX += ballSpeedX;
		ballY += ballSpeedY;
		
		ballLeftSideX = ballX - BALL_RADIUS;
		ballLeftSideY = ballY;
		
		ballRightSideX = ballX + BALL_RADIUS;
		ballRightSideY = ballY;
			
		ballUpSideX = ballX;
		ballUpSideY = ballY - BALL_RADIUS;
			
		ballDownSideX = ballX;
		ballDownSideY = ballY + BALL_RADIUS;
	}

	// Détecter la collision avec la raquette
	function checkPaddleCollision()
	{
		// Ball sur Paddle Gauche, côté droit
		if (ballLeftSideX <= leftPaddleX + PADDLE_WIDTH &&
			ballLeftSideX >= leftPaddleX &&
			ballY >= leftPaddleY &&
			ballY <= leftPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = Math.abs(ballSpeedX); // Assurer que la vitesse est positive (vers la droite)
			ballX = leftPaddleX + PADDLE_WIDTH + BALL_RADIUS; // Ajuster la position de la balle
			leftPaddleColor = GREEN;
		}

		// Ball sur Paddle Gauche, côté gauche
		if (ballRightSideX >= leftPaddleX && 
			ballRightSideX <= leftPaddleX + PADDLE_WIDTH &&
			ballY >= leftPaddleY && 
			ballY <= leftPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = -Math.abs(ballSpeedX); // Assurer que la vitesse est négative (vers la gauche)
			ballX = leftPaddleX - BALL_RADIUS; // Ajuster la position de la balle
			leftPaddleColor = RED;
		}

		// Ball sur Paddle Gauche, côté haut
		if (ballDownSideY >= leftPaddleY && 
			ballUpSideY <= leftPaddleY &&
			ballX >= leftPaddleX &&
			ballX <= leftPaddleX + PADDLE_WIDTH) {
			ballSpeedY = -Math.abs(ballSpeedY); // Assurer que la vitesse est négative (vers le haut)
			ballY = leftPaddleY - BALL_RADIUS; // Ajuster la position de la balle
			leftPaddleColor = BLUE;
		}

		// Ball sur Paddle Gauche, côté bas
		if (ballUpSideY <= leftPaddleY + PADDLE_HEIGHT &&
			ballDownSideY >= leftPaddleY + PADDLE_HEIGHT &&
			ballX >= leftPaddleX &&
			ballX <= leftPaddleX + PADDLE_WIDTH) {
			ballSpeedY = Math.abs(ballSpeedY); // Assurer que la vitesse est positive (vers le bas)
			ballY = leftPaddleY + PADDLE_HEIGHT + BALL_RADIUS; // Ajuster la position de la balle
			leftPaddleColor = YELLOW;
		}

		// Ball sur Paddle Droit, côté gauche
		if (ballRightSideX >= rightPaddleX && 
			ballRightSideX <= rightPaddleX + PADDLE_WIDTH &&
			ballY >= rightPaddleY && 
			ballY <= rightPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = -Math.abs(ballSpeedX); // Assurer que la vitesse est négative (vers la gauche)
			ballX = rightPaddleX - BALL_RADIUS; // Ajuster la position de la balle
			rightPaddleColor = MAGENTA;
		}

		// Ball sur Paddle Droit, côté droit
		if (ballLeftSideX <= rightPaddleX + PADDLE_WIDTH &&
			ballLeftSideX >= rightPaddleX && 
			ballY >= rightPaddleY && 
			ballY <= rightPaddleY + PADDLE_HEIGHT) {
			ballSpeedX = Math.abs(ballSpeedX); // Assurer que la vitesse est positive (vers la droite)
			ballX = rightPaddleX + PADDLE_WIDTH + BALL_RADIUS; // Ajuster la position de la balle
			rightPaddleColor = CYAN;
		}

		// Ball sur Paddle Droit, côté haut
		if (ballDownSideY >= rightPaddleY && 
			ballUpSideY <= rightPaddleY &&
			ballX >= rightPaddleX &&
			ballX <= rightPaddleX + PADDLE_WIDTH) {
			ballSpeedY = -Math.abs(ballSpeedY); // Assurer que la vitesse est négative (vers le haut)
			ballY = rightPaddleY - BALL_RADIUS; // Ajuster la position de la balle
			rightPaddleColor = ORANGE;
		}

		// Ball sur Paddle Droit, côté bas
		if (ballUpSideY <= rightPaddleY + PADDLE_HEIGHT &&
			ballDownSideY >= rightPaddleY + PADDLE_HEIGHT &&
			ballX >= rightPaddleX &&
			ballX <= rightPaddleX + PADDLE_WIDTH) {
			ballSpeedY = Math.abs(ballSpeedY); // Assurer que la vitesse est positive (vers le bas)
			ballY = rightPaddleY + PADDLE_HEIGHT + BALL_RADIUS; // Ajuster la position de la balle
			rightPaddleColor = PURPLE;
		}
	}

	// Gérer les collisions avec les bords du terrain pour rebonds (y)
	function checkEdgesBounce() {
		if (ballY + BALL_RADIUS >= FIELD_HEIGHT || ballY - BALL_RADIUS <= 0) {
			ballSpeedY = -ballSpeedY;
		}
	}

	// Gérer les collisions avec les bords du terrain pour buts (x)
	function checkGoals() {
		// La balle a atteint le bord gauche, réinitialiser la position
		if (ballX + BALL_RADIUS < FIELD_START_X) {
			scoreRight++;
			round++;
			newScore = true;
			newRound = true;
			console.log("Point pour right");
			setTimeout(reset(), 60000);
		}
		// La balle a atteint le bord droit, réinitialiser la position
		else if (ballX - BALL_RADIUS > FIELD_END_X) {
			scoreLeft++;
			round++;
			newScore = true;
			newRound = true;
			console.log("Point pour left");
			setTimeout(reset(), 60000);
		}
	}
	
/********************** Fonctions pour dessiner le jeu **********************/

	// Pour dessiner la balle
	function drawBall(x, y, color) {
		gameCtx.beginPath();
		gameCtx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
		gameCtx.fillStyle = color;
		gameCtx.fill();
		gameCtx.closePath();
	}

	// Pour dessiner la raquette
	function drawPaddle(x, y, color) {
		gameCtx.beginPath();
		gameCtx.rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
		gameCtx.fillStyle = color;
		gameCtx.fill();
		gameCtx.closePath();
	}

	// Pour dessiner la ligne de démarcation au centre du terrain
	function drawCenterLine() {
		gameCtx.beginPath();
		gameCtx.setLineDash([5, 5]); // Définir le motif de ligne pointillée
		gameCtx.moveTo(FIELD_HALF_X, FIELD_START_Y);
		gameCtx.lineTo(FIELD_HALF_X, FIELD_END_Y);
		gameCtx.strokeStyle = "#00ff00";
		gameCtx.stroke();
		gameCtx.closePath();
	}

	// Pour dessiner une ligne pour le quadrillage du terrain
	function drawLine(x1, x2, y1, y2) {
		gameCtx.strokeStyle = "#ffffff";
		gameCtx.lineWidth = 1;
		gameCtx.beginPath();
		gameCtx.setLineDash([1, 10]); // Définir le motif de ligne pointillée
		gameCtx.moveTo(x1, y1); // Déplacer le curseur à la position de départ
		gameCtx.lineTo(x2, y2); // Dessiner une ligne jusqu'à la position de fin
		gameCtx.stroke(); // Appliquer le dessin
	}

	// Pour dessiner le quadrillage de démarcation au centre du terrain
	function drawChessfield() {
		for (x = FIELD_START_X; x <= FIELD_END_X; x += 50)
		{
			if (x != FIELD_HALF_X)
				drawLine(x, x, FIELD_START_Y, FIELD_END_Y);
		}
		for (y = FIELD_START_Y; y <= FIELD_END_Y; y += 50)
			{
				drawLine(0, FIELD_WIDTH, y, y);
			}
	}


	// Pour réinitialiser le jeu à chaque manche
	function reset() {
		ballX = FIELD_HALF_X;
		ballY = FIELD_HALF_Y;
		ballSpeedX = 0;
		ballSpeedY = 0;
		launchSide *= -1;
		ballColor = INITIAL_BALL_COLOR;
		leftPaddleColor = INITIAL_PADDLE_COLOR;
		rightPaddleColor = INITIAL_PADDLE_COLOR;
		console.log("Score left: " + scoreLeft);
		console.log("Score right: " + scoreRight);
		gameStarted = false;
	}

//---------------- //CARO IA ------------------------------

let IA_ballY;

function updateIA_BallPos()
{
	IA_ballY = ballY;
}

// updates ball pos only once per sec
setInterval(updateIA_BallPos, 1000);

function simulateKeyPress(key) {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
}

function simulateKeyRelease(key) {
	document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
}

function getIntersectionY()
{
	let velocityY = BALL_SPEED_Y;
	let velocityX = BALL_SPEED_X;

	let intersectionY; //value we are looking for
	let intersectionX = FIELD_WIDTH - PADDLE_WIDTH;

	// let distanceToIntersection = intersectionX - ballX;
	// let timeToIntersection = distanceToIntersection / velocityX;
	
	let intersectionWithoutRebounds = ballY + (velocityY/*  * timeToIntersection */);

	//if no rebounds
	if (ballY + (velocityY/*  * timeToIntersection */) < FIELD_HEIGHT) //if current pos + vertical displacement < field height == no rebounds
			intersectionY = intersectionWithoutRebounds;
	else //if rebounds
	{
			intersectionY = intersectionWithoutRebounds % (2 * FIELD_HEIGHT); //if only one rebound?
			if (intersectionY > FIELD_HEIGHT) //means the ball is going back down after bounce
				intersectionY = 2 * FIELD_HEIGHT - intersectionY; //we substract the excess
	}

	if (intersectionY > FIELD_WIDTH / 2) //car sinon le paddle loupe souvent la balle de peu
		intersectionY = intersectionY + BALL_RADIUS;
	else
		intersectionY = intersectionY - BALL_RADIUS;

	return intersectionY;
}

function IA_move_paddle()
{

	let intersectionY = getIntersectionY();

	drawBall(FIELD_WIDTH - PADDLE_WIDTH, intersectionY, RED); //draws the intersection point

	if (ballY == FIELD_HEIGHT / 2) //pour éviter l'epilepsie du début
		return ;
	// if (ballY < rightPaddleY) //TEST : ballY known in real time
	else if (intersectionY < rightPaddleY)
	{
		// while (intersectionY < rightPaddleY)
		simulateKeyPress('ArrowUp');
		simulateKeyRelease('ArrowDown');
	}
	else if (intersectionY > rightPaddleY)
	// else if (ballY > rightPaddleY) //TEST : ballY known in real time
	{
		simulateKeyPress('ArrowDown');
		simulateKeyRelease('ArrowUp');
	}
}

// -------------------------------------------------------------------

	// Fonction pour calculer l'image du jeu à chaque frame
function play() {
	
	if (keysPressed[SPACE] && !gameStarted) {
		ballSpeedX = BALL_SPEED_X * launchSide;
		ballSpeedY = BALL_SPEED_Y;
		gameStarted = true;
		getIntersectionCounter = 0; //TEST
	}
	if (newRound)
	{
		displayRound();
		rightPaddleY = START_RIGHT_PADDLE_Y;
	}
	if (newScore)
		displayScore();
	if (scoreLeft == 10 || scoreRight == 10)
	{
		displayWinner();
		return;
	}

	gameCtx.clearRect(FIELD_START_X, FIELD_START_Y, FIELD_END_X, FIELD_END_Y);
	drawCenterLine();
	drawChessfield();
	drawBall(ballX, ballY, ballColor);
	drawPaddle(leftPaddleX, leftPaddleY, leftPaddleColor);
	drawPaddle(rightPaddleX, rightPaddleY, rightPaddleColor);
	
	leftPaddleColor = INITIAL_PADDLE_COLOR;
	rightPaddleColor = INITIAL_PADDLE_COLOR;

	keyHook();
	IA_move_paddle(); //CARO
	checkPaddleLimits();
	updateBall();
	checkPaddleCollision();
	checkEdgesBounce();
	checkGoals();
	// Appel récursif de la fonction pour dessiner le jeu à la prochaine frame
	requestAnimationFrame(play);
}

/********************** Appel des fonctions **********************/
console.log("Le jeu commence !");
play();
