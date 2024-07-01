/* installer Node.js et Express
npm init -y
npm install express body-parser */

//supprimer toute la section IA et la remplacer par ceci :


let ia					= false;

const EASY				= 0;
const MEDIUM			= 1;
const HARD				= 2;
let DIFFICULTY_LEVEL	= MEDIUM; //a modifier par le client

function setAILevel()
{
// updates ball pos only once per sec for levels easy and medium
	if (DIFFICULTY_LEVEL == EASY)
	{
		setInterval(updateAIBallPos, 1000);
		//+ ball speed slow
	}
	else if (DIFFICULTY_LEVEL == MEDIUM)
	{
		setInterval(updateAIBallPos, 1000);
		// PADDLE_SPEED = 7;
		ballSpeedX = 6;
		ballSpeedY = 6;
	}
	else if (DIFFICULTY_LEVEL == HARD)
	{
		setInterval(updateAIBallPos, 0);
		// PADDLE_SPEED = 7;
		ballSpeedX = 6;
		ballSpeedY = 6;
	}
}

//-----------------------------------

let	DOWN	= 0;
let	UP		= 1;

function simulateKeyPress(key) {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
}

function simulateKeyRelease(key) {
	document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
}

function aiMovePaddle()
{
	//TODO : requete API pour recevoir paddle_action de IA.c

	// drawBall(FIELD_WIDTH - PADDLE_WIDTH, intersectionY, RED); //draws the intersection point
	/* pour que la ligne du dessus remarche il faudrait qu'en plus de la variable paddle_action
	ia.c envoie egalement a variable predicted_intersection */

	if (!roundStarted) //pour éviter l'epilepsie du début
		return ;

	if (paddle_action = UP)
	{
		simulateKeyPress('ArrowUp');
		simulateKeyRelease('ArrowDown');
	}
	else if (paddle_action = DOWN)
	{
		simulateKeyPress('ArrowDown');
		simulateKeyRelease('ArrowUp');
	}
}


//TODO : rajouter a la fin du fichier du json pour envoyer les variables concernee dans AI.c


const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; //pourt sur lequel il doit envoyer l'info : modifier

app.use(bodyParser.json());

// Exemple de variables de jeu
// let ballPosition = { x: 0, y: 0 };
// let playerPosition = { x: 0, y: 0 };
// let iaPosition = { x: 0, y: 0 };

app.get('/game_state', (req, res) => {
	res.json({
		PADDLE_Y: paddle_y;
		paddle_action: paddle_movement;
	});
});

app.post('/ia_action', (req, res) => {
	const action = req.body.action;
	// Met à jour le jeu en fonction de l'action de l'IA
	// Par exemple: iaPosition.x += action;
	aiMovePaddle(action);
	res.json({ status: "success" });
});

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running at http://0.0.0.0:${port}/`);
});
